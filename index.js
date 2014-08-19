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
 */

// This application is currently OSX-only. 
// Feel free to submit a pull request with support for other OSes,
// but until then it will die on any other OS

if(process.env["_system_name"] !== 'OSX'){
    console.log("Sorry, your OS is unsupported. Feel free to submit a pull request :)")
    return 1
}


var yargs = require("yargs")
  , conf  = require("./conf.js")
  , fs    = require("fs")
  , lazy  = require("lazy")

/**
 * Stopp Class
 * 
 * @param   array  argv   Array of arguments passed to the script
 * @return  int           0 on success, >1 on error
 */   
function Stopp(argv){
    var that = this
    
    // Private methods
    var parseHosts = function(callback) {
        fs.readFile('/private/etc/hosts', 'utf8', function(err, data) {
            

            var lines = data.split('\n')
              , foundStartBanner = false
              , entries = []
            
            for(var i = 0; i < lines.length; i++){
                if(foundStartBanner === true && lines[i] !== ''){
                    if(lines[i] === conf.endBanner) break
                
                    var l = lines[i].trim()
                      , entry = {}
                    
                    if(l[0] === '#'){
                        entry.enabled = false
                        l = l.slice(1)
                    } else {
                        entry.enabled = true
                    }

                    l = l.replace(/\s+/g, " ").split(" ")

                    if(l.length !== 2) continue
                
                    entry.ip = l[0]
                    entry.address = l[1]

                    entries.push(entry)

                } else if(lines[i] === conf.startBanner) {
                    foundStartBanner = true
                }
            }

            //console.dir(entries)
            
            callback(false, entries)

        })
        
    }()


    if(argv.length > 0 && typeof this[argv[0]] === 'function' && this[argv[0]].callable === true){
        return this[argv[0]](argv.splice(1))      
    } else {
        if(argv.length > 0) console.log("Invalid option: " + argv[0]) 
        this.help()
    }
}

/**
 * Help Method
 * 
 * Displays usage information
 */
Stopp.prototype.help = function() {
    conf.help.forEach(function(ele) {
        console.log(ele)
    })
    
    return 0
}
Stopp.prototype.help.callable = true

/**
 * On Method
 * 
 * Turn filter ON
 *
 */
Stopp.prototype.on = function() {
    console.log("You called the 'on' method.")


}
Stopp.prototype.on.callable = true


return new Stopp(yargs.argv._)
