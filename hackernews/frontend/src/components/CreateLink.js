import { useMutation, gql } from "@apollo/client";
import React, { useState } from 'react';
import { useHistory } from 'react-router';

import { FEED_QUERY } from './LinkList';
import { LINKS_PER_PAGE } from "../constants";

const CREATE_LINK_MUTATION = gql`
mutation CreateLink($url: String!, $description: String!) {
    post(url: $url, description: $description) {
        id
        createdAt
        url 
        description
    }
}
`;

const CreateLink = () => {
    const take = LINKS_PER_PAGE;
    const skip = 0;
    const orderBy = { createdAt: "desc" };

    const [formData, setFormData] = useState({
        description: "",
        url: ""
    });
    const history = useHistory();

    const [createLink] = useMutation(CREATE_LINK_MUTATION, {
        variables: {
            description: formData.description,
            url: formData.url
        },
        onCompleted: () => history.push("/"),
        update(cache, { data: { post }}) {
            try {
                const { feed } = cache.readQuery({
                    query: FEED_QUERY,
                    variables: { take, skip, orderBy },
                }); 
                const updatedLinks = [post, ...feed.links];
                cache.writeQuery({
                    query: FEED_QUERY,
                    data: {
                        feed: {
                            links: updatedLinks
                        }
                    },
                    variables: { take, skip, orderBy }
                });
            } catch (e) {
                console.log(e.message);
            }
        },
        refetchQueries: [{ query: FEED_QUERY, variables: { take, skip: 5, orderBy }}]
    });

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                createLink();
            }}>
                <div className="flex flex-column mt3">
                    <input type="text"
                        className="mb2"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter the description"
                    />
                    <input type="text"
                        className="mb2"
                        value={formData.url}
                        onChange={e => setFormData({ ...formData, url: e.target.value })}
                        placeholder="Enter the URL"
                    />
                </div>
                <button type="submit">Create Link</button>
            </form>
        </div>
    );
}

export default CreateLink;