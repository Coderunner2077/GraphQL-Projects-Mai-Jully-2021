function id(parent, args, context, info) {
    const length = parent.links.length;
    const firstLinkId = length ? parent.links[0].id : 0;
    const lastLinkId = length ? parent.links[parent.links.length - 1].id : 0;
    
    return "Feed_" +firstLinkId + "_" + lastLinkId;
}

module.exports = {
    id
}