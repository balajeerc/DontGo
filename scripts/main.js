var Application = require('core/application');

function main()
{
    var application = new Application.instance();
    application.init();
    application.run();	
}

main();