# Exam #1 Study Plan / Client

## Overview

The front-end components of the web application "Study Plan" is developed using React.js and other assistant modules (see `package.json`), which is set to running on `http://localhost:3000`<br/>

The default route will lead the user to the view for unauthorized users, in which where only the `list of all available courses` fetched from the backend server will be visible to the user. At this stage, **all the users is able to check on corresponding information/descriptions of all the available courses.** The **navbar** will be visible in company with the list and will guide the user to complete the logging-in process with student number `matricola` and `password`.

After successfully logging in, the frontend will try to fetch the existing study plan previously defined by the user. If the list is empty the view will ask the user to define a new study plan by indicating whether the study plan is of `full time` or not. **By choose one of the options, or upon successfully fetched from the backend, the corresponding** `list of selected courses` **becomes visible.**

Once the list of selected courses is visible, the user is free to make the following operations:

-   The user can continue to **expand/contract descriptions for courses** from the `available courses' list`.
-   The user can add a course by **clicking on the expanded row of corresponding course** after confirming in that row that there is no violations of constraints from adding this course.
-   The user can **click on any course in the** `selected courses' list` **to remove the it from the list** when there is no violations of preparatory constraints.
-   Upon any adding/removing the `selected courses' list`
