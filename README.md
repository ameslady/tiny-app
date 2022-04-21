# Amy's Tiny App 

A full stack web app built with Node and Express that allows users to shorten long URLs.


# To-Do

* Update res.status errors to redirect to an error template
* Use cookie.session for registration/login functionality (better security)
* use bycrypt for password security
* move functions into helpers file and import
* make tinyapp pretty


# Questions

Should I be able to delete using the following commands if logged in, in the browser? Or, do I need to pass credentials w/ the commmand to get this to work?

* curl -X POST -i localhost:8080/urls/b2xVn2/delete

