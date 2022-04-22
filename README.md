# Amy's Tiny App 

A full stack web app built with Node and Express that allows users to shorten long URLs.


# To-Do

Core:
* Use cookie.session (encryption) for registration/login functionality ✅
* use bycrypt for password security  ✅
* Move functions into helpers file and import ✅
* Implemented unit tests ✅

Stretch:

* Method Override
* Analytics

Final tid-bits:
* Update res.status errors to redirect to an error page template w/ header
* Ensure comments are descriptive and not redundant
* Refactor code
* Make tinyapp's front-end pretty
  * Add icons
  * Create footer ✅ 


# Questions

Should I be able to delete or edit using the following commands if logged in in the browser? 
Or, do I need to pass credentials w/ these commmands to get it this to work?

* curl -X POST -i localhost:8080/urls/b2xVn2/delete
* curl -X POST -i localhost:8080/urls/b2xVn2
