#!/usr/bin/env node
/**
 * Stopp: Stop Procrastinating
 * 
 * Github: https://github.com/dav-/stopp
 *
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Derrick Cohodas
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * --
 *
 * Notes:
 * 
 *  + This code is all synchronous, as there is no real performance benefiet
 *    to async in this use case
 *    
 *  + This application is currently OSX-only. Feel free to submit a pull request
 *    with support for other OSes, but until then it will die on any other OS
 * 
 */


if(process.env["_system_name"] !== 'OSX'){
    console.log("Sorry, your OS is unsupported. Feel free to submit a pull request :)")
    return 1
}


var conf    = require("./conf.js")
  , pkg     = require("./package.json")
  , yargs   = require("yargs")
  , fs      = require("fs")
  , fs_sync = require("fs-sync")
  , colors  = require("colors")

// Don't allow this package to be required 
module.exports = new Error("The package 'stopp' cannot be required. This is a global-only command line utility. See " + pkg.homepage + " for usage information.")

/**
 * Stopp Class
 * 
 * @param   array  argv   Array of arguments passed to the script
 * @return  int           0 on success, >1 on error
 */   
function Stopp(argv){
    var that = this
    
    // ************** Private methods ************** //

    /**
     * Backs up the hosts file to ./bak/hosts-Day-Mon-DD-YYYY-HH.MM.SS.bak. This function is synchronous.
     * @return {string} Path and name of the backup
     */
    var backupHostsSync = function() {
        var filepath = conf.backupDir + '/hosts-' + new Date().toString().split(' ').slice(0,5).join('-').replace(/\:/g, '.') + '.bak'
        fs_sync.copy(conf.hostsLocation, filepath)
        return filepath
    }

    /**
     * Write new data to the hosts file. This function is synchronous
     * 
     * @param  {array} data 
     * @return {[type]}      [description]
     */
    var writeHostsFileSync = function(data) {

        if(conf.backups === true){
            console.log("Backing up hosts file...".yellow)
            var backup = backupHostsSync()
            console.log("Backup saved to ".yellow, backup.yellow.underline)
        }

        // var orig = fs_sync.read(process.env.PWD + '/hosts')
        //   , head = orig.slice(0, orig.indexOf(conf.startBanner))
        //   , body = orig.slice(orig.indexOf(conf.startBanner), orig.indexOf(conf.endBanner) + conf.endBanner.length)
        //   , tail = orig.slice(orig.indexOf(conf.endBanner) + conf.endBanner.length)
        
        var rawData = ''

        for(var i = 0; i < data.entries.length; i++) {
            var txt = data.enabled === true ? '' : '#'
            txt += conf.rerouteIP + ' ' + data[i] +'\n'
            rawData += txt
        }

        fs_sync.write(conf.hostsLocation, data.raw.head + conf.startBanner + '\n' + rawData + conf.endBanner + data.raw.tail)
    }//({enabled: true, entries: ['www.reddit.com', 'np.reddit.com', 'reddit.com'] })

    // ************** Priviliged methods ************** //

    /**
     * Parse the system's hosts file for Stopp rules. This function is synchronous
     * 
     * @param  {Function} callback  Callback function, params: (error, data)
     * @return {Object}             Object of format {enabled: bool, entries: [{ip: ip, address: address}]}
     */
    this.parseHostsSync = function() {



        var rawText           = fs_sync.read(conf.hostsLocation)
          // , lines             = rawText.split('\n')
          , startBannerCount  =  rawText.split(conf.startBanner).length-1//(rawText.match(new RegExp(conf.startBanner), 'gm') || []).length 
          , endBannerCount    =  rawText.split(conf.endBanner).length-1//(rawText.match(new RegExp(conf.endBanner), 'gm') || []).length
          , bannersPresent    =  startBannerCount === 1 && endBannerCount === 1
          , bannersAbsent     =  startBannerCount + endBannerCount === 0
          , bannerMismatch    = !(bannersPresent || bannersAbsent) 

        if(bannerMismatch) {
            console.log("\nStopp: Error: Hosts file is corrupt: Banner mismatch".red)
            console.log("Fix the issue or restore a backup from ".yellow, conf.backupDir.yellow.underline)
            console.log("Debug information:")
            console.log("\tstartBannerCount: "+ startBannerCount)
            console.log("\tendBannerCount: "+ endBannerCount)
            process.exit(1)
        }

        // console.log("startBannerCount", startBannerCount, "\nendBannerCount", endBannerCount, "\nbannersPresent: ", bannersPresent, "\nbannersAbsent", bannersAbsent, "\ncorrupt", corrupt)

        var startBannerIndex  = rawText.indexOf(conf.startBanner)
          , endBannerIndex    = rawText.indexOf(conf.endBanner)
        
        if(startBannerIndex > endBannerIndex) {
            console.log("\nStopp: Error: Hosts file is corrupt: Banners in wrong order".red)
            console.log("Fix the issue or restore a backup from ".yellow, conf.backupDir.yellow.underline)
            process.exit(1)
        }

        // Data model
        var data = { enabled: false
                   , raw: { full: rawText
                          , head: bannersPresent ? rawText.slice(0, startBannerIndex) : rawText
                          , body: bannersPresent ? rawText.slice(startBannerIndex + conf.startBanner.length, endBannerIndex) : '' // Not including banners
                          , tail: bannersPresent ? rawText.slice(endBannerIndex + conf.endBanner.length) : ''
                          }
                   , entries: []
                   }
        

        if(!bannersPresent || !data.raw.body) {
            return data
        }

        var rawEntries = data.raw.body.split('\n')

        for(var i = 0; i < rawEntries.length; i++){

            var entry = rawEntries[i].replace(/\s+/g, " ").trim() // Get rid of extra whitespace
            
            if(entry === '') continue
            
            if(entry[0] === '#'){
                entry = entry.slice(1) 
            } else {
                data.enabled = true  // If even one entry is enabled, we'll consider the entire filter to be "ON" (There shouldn't usually be a mixture of enabled/disabled entries)
            }

            entry = entry.split(" ") // Split into array on spaces

            if(entry.length !== 2) continue // Valid entries should be of length 2
        
            data.entries.push(entry[1]) // Just push the actual address, we don't really care about the IP

        }

        return data
    }

    


    if(argv.length > 0 && typeof this[argv[0]] === 'function' && this[argv[0]].callable === true){
        return this[argv[0]](argv.splice(1))      
    } else {
        if(argv.length > 0) console.log("Stopp: Invalid option: ".red, argv[0].yellow) 
        this.help()
    }
}

// ************** Public methods ************** //

/**
 * Help Method
 * 
 * Displays usage information
 */
Stopp.prototype.help = function() {
    conf.help.forEach(function(text) {
        console.log(text)
    })
    
    return 0
}
Stopp.prototype.help.callable = true // Callable from command-line (ex: `stopp help` causes this method to fire)

/**
 * On Method
 * 
 * Turn filter ON
 *
 */
Stopp.prototype.on = function() {
    var rules = this.parseHostsSync()

    if(rules.entries.length === 0){
        console.log("\nStopp: Error: Empty ruleset.\n".red)
        return
    }
    if(rules.enabled === true){
        console.log("\nStopp: Error: Stopp is already ".red+"ON\n".green.underline)
        return
    }

}
Stopp.prototype.on.callable = true

/**
 * Off Method
 * 
 * Turn filter ON
 *
 */
Stopp.prototype.off = function() {
    var rules = this.parseHostsSync()

    if(rules.entries.length === 0){
        console.log("\ntopp: Error: Empty ruleset.\n".red)
        return
    }
    if(rules.enabled === false){
        console.log("\nStopp: Error: Stopp is already ".red+"OFF\n".red.underline)
        return
    }
}
Stopp.prototype.off.callable = true

Stopp.prototype.status = function() {
    
    var rules = this.parseHostsSync()

    if(rules.enabled === true){
        console.log("\nStopp is ".yellow+"ON\n".green.underline)
    } else {
        console.log("\nStopp is ".yellow+"OFF\n".red.underline)
    }
}
Stopp.prototype.status.callable = true

Stopp.prototype.list = function() {
    
    var rules = this.parseHostsSync()

    if(rules.enabled === true){
        console.log("\nStopp status: ".yellow+"ON\n".green.underline)
    } else {
        console.log("\nStopp status: ".yellow+"OFF\n".red.underline)
    }

    if(rules.entries.length > 0){
        console.log("Rules:".yellow)
        for(var i = 0; i < rules.entries.length; i++){
            console.log('\t' + rules.entries[i].cyan)
        }
    } else {
        console.log("\tEmpty ruleset.".red)
    }
    console.log("")
}
Stopp.prototype.list.callable = true

Stopp.prototype.add = function(domains) {
    
    var rules = this.parseHostsSync()

    console.dir(rules)
}
Stopp.prototype.add.callable = true

return new Stopp(yargs.argv._)
