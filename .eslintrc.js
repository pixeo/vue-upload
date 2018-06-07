module.exports = {
    root: true,

    parserOptions: {
        parser: "babel-eslint",
        sourceType: "module",
    },
    
    env: {
        browser: true,
        node: true,
    },
    
    extends: ["airbnb-base"],
    
    plugins: ["import"],
    
    rules: {
        // this option sets a specific tab width for your code
        // http://eslint.org/docs/rules/indent
        "indent": ["error", 4, { "SwitchCase": 1 }],
        // Allow paren-less arrow functions
        "arrow-parens": 0,
        // Allow async-await
        'generator-star-spacing': 0,
        // Allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        // Do not allow console.logs etc...
        'no-console': 2,   
    },

    settings: {
        "import/resolver": {
            webpack: "webpack.config.js",
        },
    },
};
