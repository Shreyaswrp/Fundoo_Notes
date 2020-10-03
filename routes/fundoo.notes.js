module.exports = (app) => {
    
    /**
     * Define a simple route to display Message at the homepage
     */
    app.get('/', (req, res) => {
        res.json("Welcome to Fundoo Notes application.");
    });
    
}