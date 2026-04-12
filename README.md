# JSL Portfolio Piece: Kanban App Deployment & Features Implementation

## Overview

This project involves **deploying a Kanban app to Netlify**, ensuring the app's functionality and persistence through local storage, and implementing dynamic features such as task editing, deletion, sidebar interaction, and a theme toggle. The goal is to deliver a fully functional, deployable application that is responsive across devices and maintains data consistency. Students will also focus on **clean, modular code** that is well-documented for future development.

## WHAT to Submit

- **JSLPP GitHub Repo**: Your JSLPP GitHub repository
- **Recorded Presentation:** A **5-10 minutes** presentation of your project demonstrating and talking through how you solved the user stories. No slides are neccessary and you will rather showcase your code and project features as you talk through your solutions.
  - You can use any of these tools to record your presentation [Veed.io](https://www.veed.io/) [Windows recording](https://www.microsoft.com/en-us/windows/learning-center/how-to-record-screen-windows-11), [Zoom](https://www.zoom.com/), [Loom](https://www.loom.com/), [OBS](https://obsproject.com/), [Screencastify](https://www.screencastify.com/)
  - Make sure your recorded presentation link is publicly accessible and is included in your GitHub README.

## HOW to Submit Your Project

- Push Final Version to GitHub: Ensure your final work is on GitHub.
- Project Naming Convention: Make sure the name of your GitHub Repository is correct with the right naming convention. The naming convention is given in the GitHub Repo title. `StudentNo_Classcode_Group_Name-Surname_JSLPP`
- Include Presentation Assets: Include your recorded presentation link in your GitHub README.
- Deployment Link: Include a link to your deployed app in your GitHub README.
- Provide LMS Link: Submit your Project GitHub link via the [Projects] tab > JSLPP PORTFOLIO PIECE > on the Learning Management System.

## Before You Begin

**Check out the [Figma Reference File](https://www.figma.com/design/y7bFCUYL5ZHfPeojACBXg2/Challenges-%7C-JSL?node-id=6033-11092&t=XbQhBWPYxXDAqp3x-1) and the project user stories in your student dashboard** before you start building.

## Key Objectives

### Deployment & Hosting

- **Prepare the Kanban app files** for deployment, ensuring the project structure aligns with best practices for deployment.
- **Deploy the Kanban app to Netlify**, following the process of uploading your project and setting a custom deployment link.
- Test the deployed app to ensure that all features, including task creation, editing, local storage, and sorting, work as expected in a live environment.

### Initial Data Fetching & Loading State

- **Fetch tasks dynamically** from an API: https://jsl-kanban-api.vercel.app/

- **Replace any hard-coded task data**, to ensure the application receives the most up-to-date tasks.

- **Display a loading message** while the tasks are being fetched so that users are informed the data is loading.
- If fetching fails, **show an error message** to alert users to the issue.

### Data Persistence

- **Store fetched tasks in local storage** to ensure data persists across page reloads.
- On startup, **load tasks from local storage** and display them in their respective columns (To Do, Doing, Done) to maintain an organized task board.

### Task Editing & Deletion

- Allow users to **edit task details** (title, description, status) in a modal. Upon saving, the task should reflect the updated data on the board and in local storage.
- Implement a **delete button** within the modal to allow users to remove tasks. A confirmation message should appear before deleting a task, and if confirmed, the task will be removed from both the task board and local storage.

### Sidebar Interaction

- Implement a **sidebar** that contains all required elements as shown in the Figma design.
- Allow the sidebar to be **toggleable**, so users can hide or show it based on their preferences.
- Provide a mobile version of the sidebar that can be **accessed from the app logo**, and ensure it matches the design and functionality of the desktop sidebar.

### Mobile Sidebar (Menu) Functionality

- On mobile, the sidebar should function as a **menu** accessible from the top of the screen.
- Include the **theme toggle** switch in the mobile menu and ensure all features match the desktop sidebar, as shown in the Figma design.
- Ensure that the mobile menu is **closable**, allowing users to dismiss it for an unobstructed view of the tasks.

### Theme Toggle (Dark/Light Mode)

- Include a **theme toggle switch** to allow users to switch between dark mode and light mode.
- The toggle should be functional in both the **desktop sidebar** and the **mobile menu** for consistent theme switching across devices.
- Ensure all elements of the **Kanban board** are styled appropriately in dark mode, ensuring good contrast and readability.

### Stretch Goal: Adding Priority (Optional)

Enhance your task management application by introducing a **priority system**. Users should be able to select a priority level—**High, Medium, or Low**—when creating or editing tasks. The priority should be:

- **Visually displayed** on each task card as shown on the Figma design to clearly communicate urgency.
- **Saved to local storage** to ensure persistence across page reloads.
- **Editable** so users can adjust a task's importance as needed.
- **Reflected immediately** on the UI upon changes.
- **Sorted automatically** within each status column by priority (High → Medium → Low), with **High-priority tasks appearing at the top**.
- **Persistently ordered**, maintaining correct priority display after refreshing the page.

## Code Quality & Maintainability

- **Break the code into separate modules** with clear responsibilities (e.g., local storage handling, task rendering, modal management) to improve maintainability and scalability.
- Use **descriptive, meaningful variable and function names** to make the code easy to understand.
- **Document every major function and module** using **JSDoc comments** to explain the purpose, parameters, and return values of each part of the code.

## Expected Outcome

A fully functional Kanban app that:

- Dynamically fetches and displays tasks.
- Supports task editing, deletion, and persistent storage through local storage.
- Has a responsive, mobile-friendly sidebar with a theme toggle switch.
- App deployed to **Netlify** with a custom, readable URL.
- Uses modular, well-documented code that is easy to maintain and scale.

## Video Link To Presentation

(https://www.loom.com/share/cf2ab7a9575b46d78f58942c3d253fe8);
