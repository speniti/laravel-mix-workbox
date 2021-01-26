let mix = require('laravel-mix');

class Workbox {
    
    /**
     * The optional name to be used when called by Mix.
     * Defaults to the class name, lowercased.
     *
     * @return {String|Array}
     */
    name() {
        return ['generateSW', 'injectManifest'];
    }

    /**
     * All dependencies that should be installed by Mix.
     *
     * @return {Array}
     */
    dependencies() {
        this.requiresReload = `Workbox webpack plugin has now been installed. Please run "npm run dev" again.`;

        return ['workbox-webpack-plugin'];
    }

    /**
     * Register the component.
     *
     * When your component is called, all user parameters
     * will be passed to this method.
     *
     * @param  {Object} config
     * @return {void}
     *
     */
    register(config = {}) {
        this.pluginName = this.caller[0].toUpperCase() + this.caller.slice(1);

        this.config = config;
    }

    /**
     * Boot the component. This method is triggered after the
     * user's webpack.mix.js file has executed.
     */
    boot() {
        let workboxPlugin = require('workbox-webpack-plugin');

        this.plugin = new workboxPlugin[this.pluginName](Object.assign({
            swDest: 'service-worker.js'
        }, this.config));
    }

    /*
     * Plugins to be merged with the master webpack config.
     *
     * @return {Array|Object}
     */
    webpackPlugins() {
        return this.plugin;
    }

    /**
     * Override the underlying webpack configuration.
     *
     * @param  {Object} webpackConfig
     * @return {void}
     */
    webpackConfig(webpackConfig) {
        webpackConfig.output.publicPath = '';
    }
}

mix.extend(['generateSW', 'injectManifest'], new Workbox());
