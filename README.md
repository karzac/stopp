#Stopp
**A command-line utility to help you stop procrastinating**

Stopp is a simple network filter intended to be used to block yourself
from wasting time on sites like Facebook, Reddit, and Hacker News when
you're trying to get work done.

Stopp stands for Stop Procrastinating, and it works simply by adding 
entries to your system's `hosts` file, and routing them to (by default)
`0.0.0.0`, which effectively renders the desired website useless.

Stopp is super easy to toggle on and off, just use the `stopp on` and `stopp off`
commands. You may have to wait up to 5 minutes when enabling Stopp for your DNS 
cache(s) to update, but turning it off is usually instant (try doing a hard refresh
in your browser — command + shift + r in Chrome — if it doesn't update right away).

You should note that when adding domains to the filter, subdomains are always treated
as seperate domains. For example, adding `reddit.com` will not block `www.reddit.com`.
This is just how the `hosts` file works. 

Additionally, this application makes a backup of your `hosts` file each time it is
modified, and stores it in ./backups/, so if anything goes horribly wrong, you
should probably be able to recover.

Some planned (if I get around to it, or someone submits a pull request) features 
include: 
* Optionally set a timer for the filter, sgo that you can't turn it off until the timer expires
* Import and export filter lists as JSON
* Include default filter lists full of common time-wasting sites for easy plug-n-play
* Automatically detect subdomains and offer to add them to the filter (e.g. if you enter `reddit.com`, the script will offer to add `www.reddit.com`, `np.reddit.com`, etc.)
* Improved CLI design

###Notes

__Mac OS X is the only supported OS.__ _(Tested on 10.10)_

__WARNING__: Use at your own risk. This program modifies the HOSTS file on your system.  
Author(s) assume no responsibility or liability for any damages that may occur as a result, direct or indirect, of the use of this software.

__WARNING__: It is not recommended to modify your HOSTS file while the filter is ON!

###Install
`npm install -g stopp`

###Usage
`stopp <command> [args]`  (you may need to run it as root with `sudo`)
Example: `stopp add reddit.com`

####Commands:
`help - Show help menu`  
`on - Turn the filter on`  
`off - Turn the filter off`  
`status - Show the filter status`  
`list - List all filtered addresses`  
`add <domain> [<domain> ...] - Add specified domain(s) to filter (don't include http(s)://)`  
`del <domain> [<domain> ...] - Remove specified domain(s) from filter`  

###Contributing
Feel free to submit pull requests. Please adhere to the [NPM coding style](https://www.npmjs.org/doc/misc/npm-coding-style.html).

###License
MIT license. See LICENSE.md

###Misc
I wrote this application whilst procrastinating. :) 
