// tslint:disable
// graphql typescript definitions

declare namespace GQL {
    interface IGraphQLResponseRoot {
        data?: IQuery | IMutation;
        errors?: Array<IGraphQLResponseError>;
    }

    interface IGraphQLResponseError {
        message: string;            // Required for all errors
        locations?: Array<IGraphQLResponseErrorLocation>;
        [propName: string]: any;    // 7.2.2 says 'GraphQL servers may provide additional entries to error'
    }

    interface IGraphQLResponseErrorLocation {
        line: number;
        column: number;
    }

    /*
      description: null
    */
    interface IQuery {
        __typename: "Query";
        root: IRoot;
        node: Node | null;
    }

    /*
      description: null
    */
    interface IRoot {
        __typename: "Root";
        repository: IRepository | null;
        phabricatorRepo: IPhabricatorRepo | null;
        repositories: Array<IRepository>;
        symbols: Array<ISymbol>;
        currentUser: IUser | null;
        activeRepos: IActiveRepoResults;
        search: Array<SearchResult>;
        searchRepos: ISearchResults;
        searchProfiles: Array<ISearchProfile>;
        search2: ISearch2 | null;
        searchScopes2: Array<ISearchScope2>;
        revealCustomerCompany: ICompanyProfile | null;
        org: IOrg;
        sharedItem: ISharedItem | null;
        packages: Array<IPackage>;
        dependents: Array<IDependency>;
    }

    /*
      description: null
    */
    interface IRepository {
        __typename: "Repository";
        id: string;
        uri: string;
        description: string;
        language: string;
        fork: boolean;
        starsCount: number | null;
        forksCount: number | null;
        private: boolean;
        createdAt: string;
        pushedAt: string;
        commit: ICommitState;
        revState: IRevState;
        latest: ICommitState;
        lastIndexedRevOrLatest: ICommitState;
        defaultBranch: string;
        branches: Array<string>;
        tags: Array<string>;
        listTotalRefs: ITotalRefList;
        gitCmdRaw: string;
    }

    /*
      description: null
    */
    type Node = IRepository | ICommit;

    /*
      description: null
    */
    interface INode {
        __typename: "Node";
        id: string;
    }

    /*
      description: null
    */
    interface ICommitState {
        __typename: "CommitState";
        commit: ICommit | null;
        cloneInProgress: boolean;
    }

    /*
      description: null
    */
    interface ICommit {
        __typename: "Commit";
        id: string;
        sha1: string;
        tree: ITree | null;
        file: IFile | null;
        languages: Array<string>;
    }

    /*
      description: null
    */
    interface ITree {
        __typename: "Tree";
        directories: Array<IDirectory>;
        files: Array<IFile>;
    }

    /*
      description: null
    */
    interface IDirectory {
        __typename: "Directory";
        name: string;
        tree: ITree;
    }

    /*
      description: null
    */
    interface IFile {
        __typename: "File";
        name: string;
        content: string;
        repository: IRepository;
        binary: boolean;
        isDirectory: boolean;
        commit: ICommit;
        highlight: IHighlightedFile;
        blame: Array<IHunk>;
        commits: Array<ICommitInfo>;
        dependencyReferences: IDependencyReferences;
        blameRaw: string;
    }

    /*
      description: null
    */
    interface IHighlightedFile {
        __typename: "HighlightedFile";
        aborted: boolean;
        html: string;
    }

    /*
      description: null
    */
    interface IHunk {
        __typename: "Hunk";
        startLine: number;
        endLine: number;
        startByte: number;
        endByte: number;
        rev: string;
        author: ISignature | null;
        message: string;
    }

    /*
      description: null
    */
    interface ISignature {
        __typename: "Signature";
        person: IPerson | null;
        date: string;
    }

    /*
      description: null
    */
    interface IPerson {
        __typename: "Person";
        name: string;
        email: string;
        gravatarHash: string;
    }

    /*
      description: null
    */
    interface ICommitInfo {
        __typename: "CommitInfo";
        rev: string;
        author: ISignature | null;
        committer: ISignature | null;
        message: string;
    }

    /*
      description: null
    */
    interface IDependencyReferences {
        __typename: "DependencyReferences";
        dependencyReferenceData: IDependencyReferencesData;
        repoData: IRepoDataMap;
    }

    /*
      description: null
    */
    interface IDependencyReferencesData {
        __typename: "DependencyReferencesData";
        references: Array<IDependencyReference>;
        location: IDepLocation;
    }

    /*
      description: null
    */
    interface IDependencyReference {
        __typename: "DependencyReference";
        dependencyData: string;
        repoId: number;
        hints: string;
    }

    /*
      description: null
    */
    interface IDepLocation {
        __typename: "DepLocation";
        location: string;
        symbol: string;
    }

    /*
      description: null
    */
    interface IRepoDataMap {
        __typename: "RepoDataMap";
        repos: Array<IRepository>;
        repoIds: Array<number>;
    }

    /*
      description: null
    */
    interface IRevState {
        __typename: "RevState";
        commit: ICommit | null;
        cloneInProgress: boolean;
    }

    /*
      description: null
    */
    interface ITotalRefList {
        __typename: "TotalRefList";
        repositories: Array<IRepository>;
        total: number;
    }

    /*
      description: null
    */
    interface IPhabricatorRepo {
        __typename: "PhabricatorRepo";
        uri: string;
        callsign: string;
    }

    /*
      description: null
    */
    interface ISymbol {
        __typename: "Symbol";
        repository: IRepository;
        path: string;
        line: number;
        character: number;
    }

    /*
      description: null
    */
    interface IUser {
        __typename: "User";
        id: string;
        auth0ID: string;
        sourcegraphID: number | null;
        email: string;
        displayName: string | null;
        username: string | null;
        avatarURL: string | null;
        createdAt: string | null;
        updatedAt: string | null;
        orgs: Array<IOrg>;
        orgMemberships: Array<IOrgMember>;
        hasSourcegraphUser: boolean;
        tags: Array<IUserTag>;
    }

    /*
      description: null
    */
    interface IOrg {
        __typename: "Org";
        id: number;
        name: string;
        displayName: string | null;
        slackWebhookURL: string | null;
        members: Array<IOrgMember>;
        latestSettings: IOrgSettings | null;
        repos: Array<IOrgRepo>;
        repo: IOrgRepo | null;
        threads: Array<IThread>;
        threads2: IThreadConnection;
        tags: Array<IOrgTag>;
    }

    /*
      description: null
    */
    interface IOrgMember {
        __typename: "OrgMember";
        id: number;
        org: IOrg;
        user: IUser;
        username: string;
        email: string;
        displayName: string;
        avatarURL: string | null;
        userID: string;
        createdAt: string;
        updatedAt: string;
    }

    /*
      description: null
    */
    interface IOrgSettings {
        __typename: "OrgSettings";
        id: number;
        contents: string;
        highlighted: string;
        author: IUser;
        createdAt: string;
    }

    /*
      description: null
    */
    interface IOrgRepo {
        __typename: "OrgRepo";
        id: number;
        org: IOrg;
        remoteUri: string;
        createdAt: string;
        updatedAt: string;
        threads: Array<IThread>;
        threads2: IThreadConnection;
    }

    /*
      description: null
    */
    interface IThread {
        __typename: "Thread";
        id: number;
        repo: IOrgRepo;
        file: string;
        branch: string | null;
        repoRevision: string;
        linesRevision: string;
        revision: string;
        title: string;
        startLine: number;
        endLine: number;
        startCharacter: number;
        endCharacter: number;
        rangeLength: number;
        createdAt: string;
        archivedAt: string | null;
        author: IUser;
        lines: IThreadLines | null;
        comments: Array<IComment>;
    }

    /*
      description: null
    */
    interface IThreadLines {
        __typename: "ThreadLines";
        htmlBefore: string;
        html: string;
        htmlAfter: string;
        textBefore: string;
        text: string;
        textAfter: string;
        textSelectionRangeStart: number;
        textSelectionRangeLength: number;
    }

    /*
      description: null
    */
    interface IComment {
        __typename: "Comment";
        id: number;
        title: string;
        contents: string;
        createdAt: string;
        updatedAt: string;
        author: IUser;
    }

    /*
      description: null
    */
    interface IThreadConnection {
        __typename: "ThreadConnection";
        nodes: Array<IThread>;
        totalCount: number;
    }

    /*
      description: null
    */
    interface IOrgTag {
        __typename: "OrgTag";
        id: number;
        name: string;
    }

    /*
      description: null
    */
    interface IUserTag {
        __typename: "UserTag";
        id: number;
        name: string;
    }

    /*
      description: null
    */
    interface IActiveRepoResults {
        __typename: "ActiveRepoResults";
        active: Array<string>;
        inactive: Array<string>;
    }

    /*
      description: null
    */
    type SearchResult = IRepository | IFile | ISearchProfile;



    /*
      description: null
    */
    interface ISearchProfile {
        __typename: "SearchProfile";
        name: string;
        description: string | null;
        repositories: Array<IRepository>;
    }

    /*
      description: null
    */
    interface ISearchQuery {
        pattern: string;
        isRegExp: boolean;
        isWordMatch: boolean;
        isCaseSensitive: boolean;
        fileMatchLimit: number;
        includePattern?: string | null;
        excludePattern?: string | null;
    }

    /*
      description: null
    */
    interface IRepositoryRevision {
        repo: string;
        rev?: string | null;
    }

    /*
      description: null
    */
    interface ISearchResults {
        __typename: "SearchResults";
        results: Array<IFileMatch>;
        limitHit: boolean;
        cloning: Array<string>;
        missing: Array<string>;
    }

    /*
      description: null
    */
    interface IFileMatch {
        __typename: "FileMatch";
        resource: string;
        lineMatches: Array<ILineMatch>;
        limitHit: boolean;
    }

    /*
      description: null
    */
    interface ILineMatch {
        __typename: "LineMatch";
        preview: string;
        lineNumber: number;
        offsetAndLengths: Array<Array<number>>;
        limitHit: boolean;
    }

    /*
      description: null
    */
    interface ISearch2 {
        __typename: "Search2";
        results: ISearchResults;
        suggestions: Array<SearchSuggestion2>;
    }

    /*
      description: null
    */
    type SearchSuggestion2 = IRepository | IFile;



    /*
      description: null
    */
    interface ISearchScope2 {
        __typename: "SearchScope2";
        name: string;
        value: string;
    }

    /*
      description: null
    */
    interface ICompanyProfile {
        __typename: "CompanyProfile";
        ip: string;
        domain: string;
        fuzzy: boolean;
        company: ICompanyInfo;
    }

    /*
      description: null
    */
    interface ICompanyInfo {
        __typename: "CompanyInfo";
        id: string;
        name: string;
        legalName: string;
        domain: string;
        domainAliases: Array<string>;
        url: string;
        site: ISiteDetails;
        category: ICompanyCategory;
        tags: Array<string>;
        description: string;
        foundedYear: string;
        location: string;
        logo: string;
        tech: Array<string>;
    }

    /*
      description: null
    */
    interface ISiteDetails {
        __typename: "SiteDetails";
        url: string;
        title: string;
        phoneNumbers: Array<string>;
        emailAddresses: Array<string>;
    }

    /*
      description: null
    */
    interface ICompanyCategory {
        __typename: "CompanyCategory";
        sector: string;
        industryGroup: string;
        industry: string;
        subIndustry: string;
    }

    /*
      description: Represents a shared item (either a shared code comment OR code snippet).
  
  🚨 SECURITY: Every field here is accessible publicly given a shared item URL.
  Do NOT use any non-primitive graphql type here unless it is also a SharedItem
  type.
    */
    interface ISharedItem {
        __typename: "SharedItem";
        author: ISharedItemUser;
        thread: ISharedItemThread;
        comment: ISharedItemComment | null;
    }

    /*
      description: Like the User type, except with fields that should not be accessible with a
  secret URL removed.
  
  🚨 SECURITY: Every field here is accessible publicly given a shared item URL.
  Do NOT use any non-primitive graphql type here unless it is also a SharedItem
  type.
    */
    interface ISharedItemUser {
        __typename: "SharedItemUser";
        displayName: string | null;
        username: string | null;
        avatarURL: string | null;
    }

    /*
      description: Like the Thread type, except with fields that should not be accessible with a
  secret URL removed.
  
  🚨 SECURITY: Every field here is accessible publicly given a shared item URL.
  Do NOT use any non-primitive graphql type here unless it is also a SharedItem
  type.
    */
    interface ISharedItemThread {
        __typename: "SharedItemThread";
        id: number;
        repo: ISharedItemOrgRepo;
        file: string;
        branch: string | null;
        repoRevision: string;
        title: string;
        startLine: number;
        endLine: number;
        startCharacter: number;
        endCharacter: number;
        rangeLength: number;
        createdAt: string;
        archivedAt: string | null;
        author: ISharedItemUser;
        lines: ISharedItemThreadLines | null;
        comments: Array<ISharedItemComment>;
    }

    /*
      description: Like the OrgRepo type, except with fields that should not be accessible with
  a secret URL removed.
  
  🚨 SECURITY: Every field here is accessible publicly given a shared item URL.
  Do NOT use any non-primitive graphql type here unless it is also a SharedItem
  type.
    */
    interface ISharedItemOrgRepo {
        __typename: "SharedItemOrgRepo";
        id: number;
        remoteUri: string;
    }

    /*
      description: Exactly the same as the ThreadLines type, except it cannot have sensitive
  fields accidently added.
  
  🚨 SECURITY: Every field here is accessible publicly given a shared item URL.
  Do NOT use any non-primitive graphql type here unless it is also a SharedItem
  type.
    */
    interface ISharedItemThreadLines {
        __typename: "SharedItemThreadLines";
        htmlBefore: string;
        html: string;
        htmlAfter: string;
        textBefore: string;
        text: string;
        textAfter: string;
        textSelectionRangeStart: number;
        textSelectionRangeLength: number;
    }

    /*
      description: Like the Comment type, except with fields that should not be accessible with a
  secret URL removed.
  
  🚨 SECURITY: Every field here is accessible publicly given a shared item URL.
  Do NOT use any non-primitive graphql type here unless it is also a SharedItem
  type.
    */
    interface ISharedItemComment {
        __typename: "SharedItemComment";
        id: number;
        title: string;
        contents: string;
        createdAt: string;
        updatedAt: string;
        author: ISharedItemUser;
    }

    /*
      description: null
    */
    interface IPackage {
        __typename: "Package";
        lang: string;
        repo: IRepository | null;
        id: string | null;
        type: string | null;
        name: string | null;
        commit: string | null;
        baseDir: string | null;
        repoURL: string | null;
        version: string | null;
    }

    /*
      description: null
    */
    interface IDependency {
        __typename: "Dependency";
        repo: IRepository | null;
        name: string | null;
        repoURL: string | null;
        depth: number | null;
        vendor: boolean | null;
        package: string | null;
        absolute: string | null;
        type: string | null;
        commit: string | null;
        version: string | null;
        id: string | null;
    }

    /*
      description: null
    */
    interface IMutation {
        __typename: "Mutation";
        createUser: IUser;
        createThread: IThread;
        updateUser: IUser;
        updateThread: IThread;
        addCommentToThread: IThread;
        shareThread: string;
        shareComment: string;
        createOrg: IOrg;
        updateOrg: IOrg;
        updateOrgSettings: IOrgSettings;
        inviteUser: IEmptyResponse | null;
        acceptUserInvite: IOrgInviteStatus;
        removeUserFromOrg: IEmptyResponse | null;
        addPhabricatorRepo: IEmptyResponse | null;
    }

    /*
      description: Literally the exact same thing as above, except it's an input type because
  GraphQL doesn't allow mixing input and output types.
    */
    interface IThreadLinesInput {
        htmlBefore: string;
        html: string;
        htmlAfter: string;
        textBefore: string;
        text: string;
        textAfter: string;
        textSelectionRangeStart: number;
        textSelectionRangeLength: number;
    }

    /*
      description: null
    */
    interface IEmptyResponse {
        __typename: "EmptyResponse";
        alwaysNil: string | null;
    }

    /*
      description: null
    */
    interface IOrgInviteStatus {
        __typename: "OrgInviteStatus";
        emailVerified: boolean;
    }

    /*
      description: null
    */
    interface IInstallation {
        __typename: "Installation";
        login: string;
        githubId: number;
        installId: number;
        type: string;
        avatarURL: string;
    }

    /*
      description: null
    */
    interface IRefFields {
        __typename: "RefFields";
        refLocation: IRefLocation | null;
        uri: IURI | null;
    }

    /*
      description: null
    */
    interface IRefLocation {
        __typename: "RefLocation";
        startLineNumber: number;
        startColumn: number;
        endLineNumber: number;
        endColumn: number;
    }

    /*
      description: null
    */
    interface IURI {
        __typename: "URI";
        host: string;
        fragment: string;
        path: string;
        query: string;
        scheme: string;
    }
}

// tslint:enable
