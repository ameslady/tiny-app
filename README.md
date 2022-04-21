# Amy's Tiny App 

A full stack web app built with Node and Express that allows users to shorten long URLs.


# To-Do

Core:
* Use cookie.session for registration/login functionality (better security)
* use bycrypt for password security

Stretch:

* Method Override
* Analytics

Final tid bits:
* Review all requirements and thoroughly test application
* Update res.status errors to redirect to an error page template w/ header
* Move functions into helpers file and import
* Ensure comments are descriptive and not redundant
* Refactor code
* Make tinyapp's front-end pretty


# Questions

Should I be able to delete using the following commands if logged in, in the browser? Or, do I need to pass credentials w/ the commmand to get this to work?

* curl -X POST -i localhost:8080/urls/b2xVn2/delete

