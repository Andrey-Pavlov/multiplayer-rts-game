var app = {};

app.namespace = function (namespace) {
    var parts = namespace.split('.'),
        parent = app,
        i;

    if (parts[0] === "app") {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }

    return parent;
};