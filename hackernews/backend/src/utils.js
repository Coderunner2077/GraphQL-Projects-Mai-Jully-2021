const jwt = require("jsonwebtoken");

const APP_SECRET = "GraphQL_great_shit";

function getTokenPayload(authToken) {
    return jwt.verify(authToken, APP_SECRET);
}

function getUserId(req, authToken) {
    if(req) {
        const authHeader = req.headers.authorization;
        if(authHeader) {
            const token = authHeader.replace("Bearer ", "");
            if(!token) 
                throw new Error("No token provided");
            const { userId } = getTokenPayload(token);
            
            return userId;
        }
    } else if(authToken) {
        const { userId } = getTokenPayload(authToken);
        return userId;
    }

    throw new Error("Not Authenticated");
}

module.exports = {
    APP_SECRET, getUserId
}