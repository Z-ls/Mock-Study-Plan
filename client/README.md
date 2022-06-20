# Exam #1 Study Plan / Client

## Overview

> The goal is to make the application operates **exactly** the way you'd imagine when you see the screenshot

The front-end components of the web application "Study Plan" is developed using React.js and other supporting modules (mostly vanilla, see `package.json`), which is set to running on `http://localhost:3000`

The backend part meanwhile is running on `http://localhost:3001` with express.js and other modules.

## Unauthenticated Contents

The default route will lead the user to the view for unauthorized users, in which where only the `AvailableCoursesList` fetched from the backend server will be visible to the user. At this stage, *all the users is able to check on corresponding information/descriptions of all the available courses.* The `AuthNavBar` will be visible in company with the list and will guide the user to complete the logging-in process with student number `matricola` and `password`.

## Login / Logout

The `AuthNavBar` that is constantly showing is able to handle login/logout of user, and provide error information upon failing.

## After Logging in

After successfully logging in, the frontend will redirect the user to route `/edit`, and will try to fetch the existing study plan previously defined by the user. tIf the list is empty the view will ask the user to define a new study plan by indicating whether the study plan is of `full time` or not. *By choose one of the options, or upon successfully fetched from the backend, the corresponding* `SelectedCoursesList` *becomes visible.*

It is worth mentioning that before user creates study plan with either option, the `AvailableCoursesList` will be locked from adding operations but users are still able to expand/contract for further information.

## Interaction between Tables

Once the list of selected courses is visible, the user is free to make the following operations:

- The user can continue to **expand/contract descriptions for courses** from the `AvailableCoursesList`.
- The user can **add a course by clicking on the expanded row of corresponding course** after confirming in that row that there is no violations of constraints from adding this course.
  - Upon adding, **the `SelectedCoursesList` will update the preparatory course information within.**
  - Upon adding, **the `AvailableCoursesList` will update its contents from the server**, and immediately **update all information about constraint within with the just updated `SelectedCoursesList`**
- The user can **click on any course in the** `SelectedCoursesList` **to remove the it from the list** when there is no violations of preparatory constraints.
  - Similar to adding, **the two tables will each updates its content and check for constraints in turn.**

## Operations on Study Plan

During the *editing*, the user is able to:

- Cancel current modifications
  - This feature is indeed a "refresh" by fetching again the previously defined version from the persistent. In a empty study plan's case, the table will show the options of `isFullTime` again.
- Clear current list
  - This resets the list to a empty one **without altering the option about `isFullTime`** and **do not save the empty study plan to the server**. This is frequently used in combination with CANCEL to refresh current study plan.
- Delete previous/current study plan
  - This provides the user the option to *completely remove the study plan from **both the frontend and the database***. This operation is to support the user to re-define a brand new study plan with new `isFullTime` option.
    - Since the operation is **dangerous and rare**, the user will have to *confirm the operation by clicking the dialogue showed up AND clicking again on the button.*

After *definition* of study plans, that is:

- The user will be able to **Save the defined study plan** when there is no constraint violations in the study plan, this including:
  - Consists courses credits satisfying corresponding thresholds.
  - Does not contain any violations of constraints. This is enforced the application itself.

## Side-note

### Scrollbar

- The scrollbar is hidden due to aesthetic reasons. So if the user is using Chrome the scrollbar is invisible.
  - However if the user is using Firefox, a scrollbar will show up whenever user hovers on the tables (which is nice).
