var pkg    = require("./package.json")
  , colors = require("colors")

module.exports = {
    startBanner: "#### START STOPP CONFIGURATION - DO NOT MODIFY THIS LINE OR BELOW ####"
  , endBanner: "#### END STOPP CONFIGURATION - DO NOT MODIFY THIS LINE OR ABOVE ####"
  , backups: true
  , backupDir: process.env.PWD + '/backups/'
  , rerouteIP: '0.0.0.0'
  , hostsLocation: process.env.PWD + '/hosts' //'/private/etc/hosts'

  , help: [ // Each array element will be printed on its own line
            ""
          , ("Stopp: Stop Procrastination. (v" + pkg.version + ") - "+pkg.homepage).cyan
          , "Copyright (c) 2014 Derrick Cohodas, All Rights Reserved. See "+(pkg.homepage+"/LICENSE.md").underline+" for license information."
          , ""
          , "WARNING: Use at your own risk. This program modifies the HOSTS file on your system.".red
          , "Author(s) assume no responsibility or liability for any damages that may occur as a result, direct or indirect, of the use of this software."
          , ""  
          , "WARNING: It is not recommended to modify your HOSTS file while the filter is ON!".red  
          , ""
          , "Usage: stopp <command> [args]".yellow
          , "Example: "+"stopp add reddit.com".cyan
          , "Example: "+"stopp del youtube.com www.youtube.com facebook.com".cyan
          , ""
          , "Commands:".yellow
          , "\thelp".cyan+"                            Show this menu"
          , "\ton".cyan+"                              Turn the filter on"
          , "\toff".cyan+"                             Turn the filter off"
          , "\tstatus".cyan+"                          Show the filter status"
          , "\tlist".cyan+"                            List all filtered addresses"
          , "\tadd <domain> [<domain> ...]   ".cyan+"  Add specified domain(s) to filter (don't include http(s)://)." 
          , "\tdel <domain> [<domain> ...]".cyan+"     Remove specified domain(s) from filter"
          , ""
          , "NOTE: Subdomains are treated as unique, so adding an entry for \"reddit.com\" will not block \"www.reddit.com\""
          , ""
          ]
}
