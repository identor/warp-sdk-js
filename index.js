// References
var _ = require('underscore');

// Define Warp Client
var Warp = {
    _http: require('./http'),
    Object: require('./object'),
    Query: require('./query'),
    Error: require('./error'),
    User: require('./user'),
    File: require('./file'),
    Function: require('./function')
};

_.extend(Warp, {
    _apiKey: null,
    _baseURL: '',
    _initializeClasses: function() {        
        // Prepare classes
        this.Object.initialize(this._http);
        this.File.initialize(this._http);
        this.Function.initialize(this._http);
        this.Query.initialize(this._http, this.Object, this.File);
    },
    initialize: function(config) {        
        // Check if the API Key has been set
        if(!config.apiKey) throw new Warp.Error(Warp.Error.Code.MissingConfiguration, 'API Key must be set');
        this._apiKey = config.apiKey;
        this._baseURL = config.baseURL || this._baseURL;
        
        // Prepare http
        this._http.initialize({ 
            apiKey: this._apiKey, 
            baseURL: this._baseURL
        });
        
        // Initialize classes
        this._initializeClasses();
    },
    bind: function(api) {
        // Create Warp for Node
        var WarpNode = _.extend({}, this, {
            _http: require('./http-node')
        });
        
        // Prepare HTTP for Node
        WarpNode._http.initialize(api)
        
        // Initialize classes
        WarpNode._initializeClasses();
        WarpNode.User._persistentSessions = false;
        
        return WarpNode;  
    }
});

module.exports = Warp;