package campaigns

import (
	"context"

	"github.com/graph-gophers/graphql-go"
	"github.com/sourcegraph/sourcegraph/cmd/frontend/graphqlbackend"
	"github.com/sourcegraph/sourcegraph/cmd/frontend/graphqlbackend/graphqlutil"
)

func (GraphQLResolver) CampaignsDefinedIn(ctx context.Context, projectID graphql.ID, arg *graphqlutil.ConnectionArgs) (graphqlbackend.CampaignConnection, error) {
	// Check existence.
	project, err := graphqlbackend.ProjectByID(ctx, projectID)
	if err != nil {
		return nil, err
	}

	list, err := dbCampaigns{}.List(ctx, dbCampaignsListOptions{ProjectID: project.DBID()})
	if err != nil {
		return nil, err
	}
	campaigns := make([]*gqlCampaign, len(list))
	for i, a := range list {
		campaigns[i] = &gqlCampaign{db: a}
	}
	return &campaignConnection{arg: arg, campaigns: campaigns}, nil
}

type campaignConnection struct {
	arg   *graphqlutil.ConnectionArgs
	campaigns []*gqlCampaign
}

func (r *campaignConnection) Nodes(ctx context.Context) ([]graphqlbackend.Campaign, error) {
	campaigns := r.campaigns
	if first := r.arg.First; first != nil && len(campaigns) > int(*first) {
		campaigns = campaigns[:int(*first)]
	}

	campaigns2 := make([]graphqlbackend.Campaign, len(campaigns))
	for i, l := range campaigns {
		campaigns2[i] = l
	}
	return campaigns2, nil
}

func (r *campaignConnection) TotalCount(ctx context.Context) (int32, error) {
	return int32(len(r.campaigns)), nil
}

func (r *campaignConnection) PageInfo(ctx context.Context) (*graphqlutil.PageInfo, error) {
	return graphqlutil.HasNextPage(r.arg.First != nil && int(*r.arg.First) < len(r.campaigns)), nil
}