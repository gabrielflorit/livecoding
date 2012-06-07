# aigua

## TODO

### Slider

* when you're to the right, the left position/width has been reset, and viceversa
* fix increment steps
* add better handle ... handling (make it wider? make handle mouseover visible?)
* add the down-arrow under bar bottom center
* change the color to red
* position the slider precisely above the token (it's hardcoded at the moment)


### Misc
* consolidate code - too much individual DOM access ($('#bar').doThis(), $('#bar').doThisAgain())



## JavaScript namespacing pattern

    var namespace = (function () {
        // defined within the local scope
        var privateMethod1 = function () { /* ... */ }
        var privateMethod2 = function () { /* ... */ }
        var privateProperty1 = 'foobar';
        return {
            // the object literal returned here can have as many
            // nested depths as you wish, however as mentioned,
            // this way of doing things works best for smaller,
            // limited-scope applications in my personal opinion
            publicMethod1: privateMethod1,
            //nested namespace with public properties
            properties:{
                publicProperty1: privateProperty1
            },
            //another tested namespace
            utils:{
                publicMethod2: privateMethod2
            }
            ...
        }
    })();
