- [x] **A course can have a maximum number of students able to add it into the study plan.**

- [x] **In this page[j][k], if no study plan has been created yet, the user may create an empty one, by specifying the full-time or part-time option; this empty list can be edited according to the following instructions[l][m][n][o].**

- [x] **The user may “Cancel” the current modifications, and in this case the persistent copy (if any) must not be modified.**

- [x] **When saving, the study plan must be validated according to the min-max number of credits.[al][am][an][ao]**

- [x] **Additionally, the user may “Delete” the entire study plan, including the persistent copy.**

- [x] **After each of these actions, the application will be in the logged-in [ap][aq][ar][as][at][au][av]home page.**

Project requirements
The application architecture and source code must be developed by adopting the **best practices in software development**, in particular those relevant to single-page applications (SPA) using React and HTTP APIs.

The communication between client and server must follow the **“two servers” pattern**, by properly configuring CORS, and **React must run in “development” mode**.

- [x] **User authentication (login) and API access must be implemented with passport.js and session cookies.** No further protection mechanism is required. The user registration procedure is not requested.

The project database must be implemented by the student, and **must be pre-loaded with at least five students**, **at least one with a part-time study plan, at least one with a full-time study plan[ay][az][ba][bb]. At least two courses should have reached the maximum number of enrolled students.**

**Contents of the README.md file
The README.md file must contain the following information (a template is available in the project repository). Generally, each information should take no more than 1-2 lines.**

```
Server-side:
A list of the HTTP APIs offered by the server, with a short description of the parameters and o the exchanged objects
A list of the database tables, with their purpose
Client-side:
A list of ‘routes’ for the React application, with a short description of the purpose of each route
A list of the main React components
Overall:
A screenshot of the logged-in home page during an editing session. This screenshot must be embedded in the README by linking an image committed in the repository.
Username and password of the defined users.
Submission procedure
```

To correctly submit the project, you must:

- [x] [a]In the beginning, it is written that when the user logs in, if they already have a study plan, it is immediately displayed in the same page and can be edited. However, at the end, it is mentioned that when the edit is submitted, the application will go to the logged-in homepage. So, I think it is not clear that in which page the edit should be done.

- [x] [b]There is no ambiguity. **The logged-in home page contains the (editable) study plan, if one has been created, or the request to create a new one (by selecting full/part-time), is none has been created (or one has been deleted).**

- [x] **The state of the application right after login is the same as the state after the form submission.**

- [x] [c]**So the state of the application does not change after the submission if the user already has a study plan and did not delete it.** Thank you.

- [x] [v]During the editing, a user can change the study plan option (full-time / part-time)?

- [x] [w]No. **It may only be changed by "Deleting" the entire study plan, and then creating a new one.**

- [x] [ar]**The anonymous page only shows the full courses.**

- [x] **The logged-in page shows the full courses (with markings about valid/invalid courses) AND my personal study plan (editable).**

- [x] **At the end of the day, we will pass from normal to editing mode by clicking a button, and from editing to static by doing the same, so it won't be really different.**

- [x] [ba]So the information about full-time and part-time is linked to the user in the db?

- [x] [bb]**From the logical point of vies, the part-time or full-time is an attribute of the Study Plan. However, since a user may have AT MOST ONE study plan, you may store this info in the user table.**
