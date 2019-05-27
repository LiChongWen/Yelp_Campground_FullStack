# Yelp_Campground-FullStack-
A complete Yelp style Campground rating website with Responsive Web Design
- Visit following link to see deployed version:
- https://gentle-brushlands-84654.herokuapp.com/

## Front-end
(Responsive Web Design)

- Bootstrap 
- jQuery

## Back-end

- NodeJS
- ExpressJS
- MongoDB (Database)
- PassportJS (User authentication)

## Main function

- Allow user to browse and search the existing Campgrounds and view the price, comments and show the location though GoogleMap (Using GoogleMap API)
- Prevented user to add New Campgrounds or comments if not logged in (Using PassportJS for authentication, MongoDB for data persistence)
- Allowing user to sign up an account 
- Or if forget the password, rest the password by sending user's email address 
  an unqiue link with limited time to reset the password(Using Nodemailer and Gmail)
- Allow users to edit or delete the Campgrounds or Comments they created also 
  prevent to do so to other content not created bt themselves(Using PassportJS for authentication, MongoDB for data validation)
- Having an administer account that allows all the possible operations towarding to all content.
- For every invaild operation, having a flash notification on the top of the page to notify user. Disappear after refresh.
