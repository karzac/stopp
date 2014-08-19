#Stopp
__A command-line utility to help you stop procrastinating.__

__Mac OS X is the only supported OS.__ _(Tested on 10.10)_

__WARNING__: Use at your own risk. This program modifies the HOSTS file on your system.

Author(s) assume no responsibility or liability for any damages that may occur as a result, direct or indirect, of the use of this software.

*NOTE*: Do not modify your HOSTS file while the filter is ON!

###Install
`npm install -g stopp`

###Usage
stopp <command> [args]
Example: stopp add reddit.com

####Commands:
`help                Show help menu`
`on                  Turn the filter on`
`off                 Turn the filter off`
`status              Show the filter status`
`list                List all filtered addresses`
`add [addresses]     Add specified address(es) to filter. IP or URL, do not include http(s)`
`del [addresses]     Remove specified address(es) from filter`

###Contributing
Feel free to submit pull requests. Please adhere to the [NPM coding style](https://www.npmjs.org/doc/misc/npm-coding-style.html).

###License
MIT license. See LICENSE.md

###Misc
I wrote this application whilst procrastinating. :) 
