var pkg = require("./package.json");
module.exports = {
    help: [ // Each array element will be printed on its own line
            "Stopp: Stop Procrastination. (v" + pkg.version + ")"
          , "Copyright (c) 2014 Derrick Cohodas, All Rights Reserved. See https://github.com/dav-/stopp/LICENSE.md for license information."
          , ""
          , "WARNING: Use at your own risk. This program modifies the HOSTS file on your system."
          , "Author(s) assume no responsibility or liability for any damages that may occur as a result, direct or indirect, of the use of this software."
          , ""  
          , "NOTE: Do not modify your HOSTS file while the filter is ON!"  
          , ""
          , "Usage: stopp <command> [args]"
          , "Example: stopp add reddit.com"
          , ""
          , "Commands:"
          , "help                Show this menu"
          , "on                  Turn the filter on"
          , "off                 Turn the filter off"
          , "status              Show the filter status"
          , "list                List all filtered addresses"
          , "add [addresses]     Add specified address(es) to filter. IP or URL, do not include http(s)" 
          , "del [addresses]     Remove specified address(es) from filter"
          ]
  , startBanner: "#### START STOPP CONFIGURATION - DO NOT MODIFY THIS LINE OR BELOW ####"
  , endBanner: "#### END STOPP CONFIGURATION - DO NOT MODIFY THIS LINE OR ABOVE ####"
 

}
