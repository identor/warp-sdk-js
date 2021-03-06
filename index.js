// References
var _ = require('underscore');

// Define Warp Client
var Warp = {
    _apiKey: null,
    _baseURL: '',
    File: require('./file'),
    Error: require('./error'),
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

        // Prepare classes
        this.Object = require('./object').extend();
        this.Query = require('./query').extend();
        this.User = require('./user').extend(this.Object);
        this.Function = require('./function').extend();
        
        // Check if http is client-side or server-side
        if(config.environment == 'server') {
            this._http = require('./http-server').extend();
            this.User._persistentSessions = false;
        }
        else
            this._http = require('./http').extend();
        
        // Prepare http
        this._http.initialize({ 
            apiKey: this._apiKey, 
            baseURL: this._baseURL,
            timeout: config.timeout
        });

        // Copy storage library
        this.User._storage = this._http._storage;
        
        // Initialize classes
        this._initializeClasses();
    },
    bind: function(api) {
        // Create Warp for Node
        var WarpNode = _.extend({}, this);
        
        // Initialize classes
        WarpNode._http = require('./http-node').extend();
        WarpNode.Object = require('./object').extend();
        WarpNode.Query = require('./query').extend();
        WarpNode.User = require('./user').extend(WarpNode.Object);
        WarpNode.Function = require('./function').extend();
        
        // Prepare HTTP for Node
        WarpNode._http.initialize(api);
        WarpNode._initializeClasses();
        WarpNode.User._persistentSessions = false;
        WarpNode.User._hasSuperAccess = true;
        
        return WarpNode;
    },
    extend: function(config) {
        // Create Warp subclass
        var WarpSubclass = _.extend({}, this);

        // Check if the API Key has been set
        if(!config.apiKey) throw new Warp.Error(Warp.Error.Code.MissingConfiguration, 'API Key must be set');
        WarpSubclass._apiKey = config.apiKey;
        WarpSubclass._baseURL = config.baseURL || this._baseURL;
        WarpSubclass._timeout = config.timeout;

        // Prepare classes
        WarpSubclass.Object = require('./object').extend();
        WarpSubclass.Query = require('./query').extend();
        WarpSubclass.User = require('./user').extend(WarpSubclass.Object);
        WarpSubclass.Function = require('./function').extend();
        
        // Check if http is client-side or server-side
        if(config.environment == 'server') {
            WarpSubclass._http = require('./http-server').extend();
            WarpSubclass.User._persistentSessions = false;
        }
        else
            WarpSubclass._http = require('./http').extend();
        
        // Prepare http
        WarpSubclass._http.initialize({ 
            apiKey: WarpSubclass._apiKey, 
            baseURL: WarpSubclass._baseURL,
            timeout: WarpSubclass._timeout
        });

        // Copy storage library
        WarpSubclass.User._storage = WarpSubclass._http._storage;
        
        // Initialize classes
        WarpSubclass._initializeClasses();

        return WarpSubclass;
    }
};

module.exports = Warp;