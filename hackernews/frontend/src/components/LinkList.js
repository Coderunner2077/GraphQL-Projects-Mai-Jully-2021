import { useQuery, gql } from "@apollo/client";
import Link from "./Link";

import { LINKS_PER_PAGE } from '../constants';
import { useHistory } from "react-router";

export const FEED_QUERY = gql`
query FeedQuery($take: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed (take: $take, skip: $skip, orderBy: $orderBy) {
        id
        links {
            id
            createdAt
            url
            description
            votes {
                id
                user {
                    id
                }
            }
            postedBy {
                id
                name
            }
        }
        count
    }
}
`;

const NEW_LINK_SUBSCRIPTION = gql`
    subscription {
        newLink {
            id
            url
            description
            createdAt
            postedBy {
                id
                name
            }
            votes {
                id
                user {
                    id
                }
            }
        }
    }
`;

const NEW_VOTE_SUBSCRIPTION = gql`
    subscription {
        newVote {
            id
            link {
                id
                url
                description
                createdAt
                postedBy {
                    id
                    name
                }
                votes {
                    id
                }
            }
            user {
                id
                name
            }
        }
    }
`;

function getQueryVariables(isNewPage, page) {
    const take = isNewPage ? LINKS_PER_PAGE : 100;
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const orderBy = { createdAt: "desc"};
    return { take, skip, orderBy };
}


const LinkList = () => {
    const history = useHistory();
    const isNewPage = history.location.pathname.includes("new");
    const pageIndexParams = history.location.pathname.split("/");
    const page = parseInt(pageIndexParams[pageIndexParams.length - 1]);
    const pageIndex = page ? (page - 1) : 0;

    const { 
        data,
        loading,
        error,
        subscribeToMore
    } = useQuery(FEED_QUERY, {
        variables: getQueryVariables(isNewPage, page)
    });

    
    
    subscribeToMore({
        document: NEW_LINK_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
            if(!subscriptionData.data.newLink) return prev;
            const newLink = subscriptionData.data.newLink;
            const exists = prev.feed.links.find(({ id }) => id === newLink.id);
            if(exists) return prev;

            return Object.assign({}, prev, {
                feed: {
                    links: [newLink, ...prev.feed.links],
                    count: prev.feed.links.length + 1,
                    __typename: prev.feed.__typename
                }
            });
        }
    });

    subscribeToMore({
        document: NEW_VOTE_SUBSCRIPTION
    });
    /* // ceci n'a pas fonctionné (je n'ai pas a l'ecrire pour le vote cela se fait automatiquement)
        updateQuery: (prev, {subscriptionData }) => {
            if(!subscriptionData.data.newVote) return prev;
            const newVote = subscriptionData.data.newVote;
            const upvotedLink = prev.feed.links.find(link => 
               link.id === newVote.link.id
            );
            if(!upvotedLink) return prev;

            const exists = upvotedLink.votes.includes(newVote);

            if(exists) return prev;
            
            upvotedLink.votes.push(newVote);
            prev.feed.links.splice(prev.feed.links.indexOf(upvotedLink), 1, upvotedLink);

            return prev;
        }
    */

    const getLinksToRender = (isNewPage, data) => {
        if(isNewPage) return data.feed.links;
        const rankedLinks = data.feed.links.slice();
        rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
        return rankedLinks;
    }

    return ( 
        <div>
            { loading && <p>Loading...</p> }
            { error && <pre>{JSON.stringify(error, null, 2)}</pre>}
            { data && (
                <>
                    { getLinksToRender(isNewPage, data).map((link, index) => 
                        <Link key={link.id} link={link} index={index} />
                    )}
                </>
            )}
            {data && isNewPage && (
                <div className="flex ml4 mv3 gray">
                    {page > 1 && (
                        <div className="pointer mr2"
                            onClick={() => history.push(`/new/${page -1}`)}
                        >
                            Previous
                        </div>
                    )}
                    {page <= data.feed.count / LINKS_PER_PAGE && (
                        <div className="pointer"
                            onClick={() => history.push(`/new/${page + 1}`)}
                        >
                            Next
                        </div>
                    )}
                </div>
            )}
           
        </div>
    );
}
 
export default LinkList;