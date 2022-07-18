import React, { useState} from "react";
import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/client";
import Link from "./Link";

// Side node. withApollo function when wrapped around a component it injects the ApolloClient
// instance into the components props

const SEARCH_FEED_QUERY = gql`
    query SearchFeedQuery($filter: String) {
        feed(filter: $filter) {
            links {
                id
                description
                url
                createdAt
                postedBy {
                    id
                    name
                }
                votes {
                    id
                    user {
                        id
                        name
                    }
                }
            }
        }
    }
`; 

const Search = () => {
    const [filter, setFilter] = useState("");

    const [executeSearch, { data }] = useLazyQuery(SEARCH_FEED_QUERY); // Note: If I pass filter as arg it will automatically fetch data using search input

    return ( 
        <>
            <form onSubmit={e => { 
                e.preventDefault();
                executeSearch({ variables: { filter }})
            }}>
                <input type="search"
                    className=""
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    placeholder="Search..."
                />
                <button type="submit">
                    OK
                </button>

            </form>
            {data && (
                data.feed.links.map((link, index) => (
                    <Link key={link.id} link={link} index={index} />
                ))
            )}
        </>
     );
}
 
export default Search;