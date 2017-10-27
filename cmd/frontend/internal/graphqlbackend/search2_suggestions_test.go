package graphqlbackend

import (
	"context"
	"reflect"
	"sync"
	"testing"

	sourcegraph "sourcegraph.com/sourcegraph/sourcegraph/pkg/api"
	store "sourcegraph.com/sourcegraph/sourcegraph/pkg/localstore"
)

func TestSearch2Suggestions(t *testing.T) {
	createSearchResolver2 := func(t *testing.T, query, scopeQuery string) *searchResolver2 {
		args := &searchArgs2{Query: query, ScopeQuery: scopeQuery}
		r, err := (&rootResolver{}).Search2(args)
		if err != nil {
			t.Fatal("Search2:", err)
		}
		return r
	}
	getSuggestions := func(t *testing.T, query, scopeQuery string) []string {
		r := createSearchResolver2(t, query, scopeQuery)
		results, err := r.Suggestions(context.Background(), &searchSuggestionsArgs{})
		if err != nil {
			t.Fatal("Suggestions:", err)
		}
		resultDescriptions := make([]string, len(results))
		for i, result := range results {
			resultDescriptions[i] = testStringResult(result)
		}
		return resultDescriptions
	}
	testSuggestions := func(t *testing.T, query, scopeQuery string, want []string) {
		got := getSuggestions(t, query, scopeQuery)
		if !reflect.DeepEqual(got, want) {
			t.Errorf("got != want\ngot:  %v\nwant: %v", got, want)
		}
	}

	t.Run("empty", func(t *testing.T) {
		testSuggestions(t, "", "", []string{})
	})

	t.Run("whitespace", func(t *testing.T) {
		testSuggestions(t, " ", " ", []string{})
	})

	t.Run("single term", func(t *testing.T) {
		var mu sync.Mutex
		reposListCalls := map[string][]*sourcegraph.Repo{
			"foo": []*sourcegraph.Repo{{URI: "foo-repo"}},
			"":    []*sourcegraph.Repo{{URI: "bar-repo"}},
		}
		store.Mocks.Repos.List = func(_ context.Context, op *store.RepoListOp) ([]*sourcegraph.Repo, error) {
			mu.Lock()
			defer mu.Unlock()
			repos, expected := reposListCalls[op.Query]
			delete(reposListCalls, op.Query)
			if !expected {
				t.Errorf("unexpected %q", op.Query)
			}
			return repos, nil
		}
		store.Mocks.Repos.MockGetByURI(t, "repo", 1)
		calledSearchRepos := false
		mockSearchRepos = func(args *repoSearchArgs) (*searchResults, error) {
			mu.Lock()
			defer mu.Unlock()
			calledSearchRepos = true
			if want := "foo"; args.Query.Pattern != want {
				t.Errorf("got %q, want %q", args.Query.Pattern, want)
			}
			return &searchResults{
				results: []*fileMatch{
					{uri: "git://repo?rev#dir/file", JPath: "dir/file"},
				},
			}, nil
		}
		defer func() { mockSearchRepos = nil }()
		testSuggestions(t, "foo", "", []string{"repo:foo-repo", "file:dir/file"})
		if len(reposListCalls) != 0 {
			t.Errorf("reposListCalls: %+v", reposListCalls)
		}
		if !calledSearchRepos {
			t.Error("!calledSearchRepos")
		}
	})

	t.Run("repo: field", func(t *testing.T) {
		var mu sync.Mutex
		calledReposList := false
		store.Mocks.Repos.List = func(_ context.Context, op *store.RepoListOp) ([]*sourcegraph.Repo, error) {
			mu.Lock()
			defer mu.Unlock()
			calledReposList = true
			if want := "foo"; op.Query != want {
				t.Errorf("got %q, want %q", op.Query, want)
			}
			return []*sourcegraph.Repo{{URI: "foo-repo"}}, nil
		}
		calledSearchFiles := false
		mockSearchFilesForRepoURI = func(query string, repoURI string, limit int) ([]*searchResultResolver, error) {
			mu.Lock()
			defer mu.Unlock()
			calledSearchFiles = true
			if want := ""; query != want {
				t.Errorf("got %q, want %q", query, want)
			}
			if want := "foo-repo"; repoURI != want {
				t.Errorf("got %q, want %q", repoURI, want)
			}
			return []*searchResultResolver{
				{result: &fileResolver{path: "dir/file", commit: commitSpec{RepoID: 1}}, score: 1},
			}, nil
		}
		defer func() { mockSearchFilesForRepoURI = nil }()
		testSuggestions(t, "repo:foo", "", []string{"repo:foo-repo", "file:dir/file"})
		if !calledReposList {
			t.Error("!calledReposList")
		}
		if !calledSearchFiles {
			t.Error("!calledSearchFiles")
		}
	})

	t.Run("repo: and file: field", func(t *testing.T) {
		var mu sync.Mutex
		calledReposList := false
		store.Mocks.Repos.List = func(_ context.Context, op *store.RepoListOp) ([]*sourcegraph.Repo, error) {
			mu.Lock()
			defer mu.Unlock()
			calledReposList = true
			if want := "foo"; op.Query != want {
				t.Errorf("got %q, want %q", op.Query, want)
			}
			return []*sourcegraph.Repo{{URI: "foo-repo"}}, nil
		}
		calledSearchFiles := false
		mockSearchFilesForRepoURI = func(query string, repoURI string, limit int) ([]*searchResultResolver, error) {
			mu.Lock()
			defer mu.Unlock()
			calledSearchFiles = true
			if want := ""; query != want {
				t.Errorf("got %q, want %q", query, want)
			}
			if want := "foo-repo"; repoURI != want {
				t.Errorf("got %q, want %q", repoURI, want)
			}
			return []*searchResultResolver{
				{result: &fileResolver{path: "dir/bar-file", commit: commitSpec{RepoID: 1}}, score: 1},
				{result: &fileResolver{path: "dir/qux-file", commit: commitSpec{RepoID: 1}}, score: 1},
			}, nil
		}
		defer func() { mockSearchFilesForRepoURI = nil }()
		testSuggestions(t, "repo:foo file:bar", "", []string{"file:dir/bar-file"})
		if !calledReposList {
			t.Error("!calledReposList")
		}
		if !calledSearchFiles {
			t.Error("!calledSearchFiles")
		}
	})
}
