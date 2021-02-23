
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
<!--ReactSkipperStart -->
<br />
<p align="center">
  <a href="https://github.com/suasllc/dronest">
    <img src="react-app/src/pictures/dronestlogo3.png" alt="Logo" width="200" height="80" style="object-fit: contain">
  </a>

  <h2 align="center">Dronest</h2>

  <p align="center">
    A Full-Stack Web Application (Social Network, Instagram/FaceBook-like) for users to host and share their drone arts (pics/vids) and get socialized on the platform.
    This application features one React/Redux frontend and two backend servers, one main server serving all database and api routes, and one extra websocket server for instantmessaging.
    <br />
    This is my <a href='www.appacademy.io' target='_blank'>App Academy</a> capstone graduation project
    <br />
    <a href="https://github.com/suasllc/dronest/wiki"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://dronest.herokuapp.com/">View Demo/Live</a>
    ·
    <a href="https://github.com/suasllc/dronest/issues">Report Bug</a>
    ·
    <a href="https://github.com/suasllc/dronest/issues">Request Feature</a>
  </p>
</p>



<details >
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

## About The Project
<!--ReactSkipperEnd -->

<!--ReactSkipperStart -->
<details open="open">
   <summary><h3 style="display: inline-block">Screenshots</h3></summary>
   <details open="open">
      <summary><h3 style="display: inline-block">Home page</h3></summary>
      <div style="display: flex">
         <img src="./resources/screenshots/home.png" width="50%" height="50%" style="margin: 5px"/>
         <img src="./resources/screenshots/home-darkmode.png" width="50%" height="50%"  style="margin: 5px"/>
      <div>
   </details>
</details>


### Technologies
| A. Package  	| B. FrontEnd  	| C. Backend  	| (cont.) |
|---	|---	|---	|---  |
|  |  |  Main server |  Websocket Server  |
| [npm](https://www.npmjs.com/)   	| [JavaScript](https://www.javascript.com/)  	|  [Python](https://www.python.org/) 	| [Websocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) |
| [Docker](https://www.docker.com/)  	| [React](https://github.com/facebook/react)  	|  [Flask](https://flask.palletsprojects.com/en/1.1.x/) 	| [NodeJS](https://nodejs.org/en/) |
| [Heroku](https://heroku.com) 	| [Redux](https://github.com/reduxjs/redux) 	|  [SqlAlchemy](https://flask-sqlalchemy.palletsprojects.com/en/2.x/) 	| [Sequelize](https://sequelize.org/) |
| [Pipenv](https://pypi.org/project/pipenv/)	| [CSS3](https://www.w3.org/Style/CSS/) 	|  [PostgreSQL](https://www.postgresql.org/) 	|  |
| [Heroku](https://heroku.com) 	| [Redux](https://github.com/reduxjs/redux) 	|  [SqlAlchemy](https://flask-sqlalchemy.palletsprojects.com/en/2.x/) 	| [Sequelize](https://sequelize.org/) |
| 	| [HTML5](https://en.wikipedia.org/wiki/HTML5)	|  [AWS S3](https://aws.amazon.com/) 	|  |
<!--ReactSkipperEnd -->

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

Install npm on your local computer
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation
#### Getting started
1. Clone this repository (only this branch)

   ```bash
   git clone https://github.com/suasllc/dronest.git
   ```

2. Install dependencies

      ```bash
      pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt
      ```

3. [Further steps here](https://github.com/suasllc/dronest/wiki/Installation-Details)


## More Screenshots

   <details open="open">
      <summary><h3 style="display: inline-block">Profile Page</h3></summary>   
      <div style="display: flex">
         <img src="./resources/screenshots/profilepage.png" width="50%" height="50%" style="margin: 5px"/>
         <img src="./resources/screenshots/follower-following.png" width="50%" height="50%"  style="margin: 5px"/>
      <div>
   </details>
   <details open="open">
      <summary><h3 style="display: inline-block">Message, Stories and Upload</h3></summary>   
      <div style="display: flex">
         <div style='display: flex; flex-direction: column'>
            <img src="./resources/screenshots/instantmessage.png" width="100%" height="100%" style="margin: 5px"/>
            <img src="./resources/screenshots/stories.png" width="100%" height="100%" style="margin: 5px"/>
         </div>
         <img src="./resources/screenshots/newpost.png" width="50%" height="50%"  style="margin: 5px"/>
      <div>
   </details>

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://github.com/suasllc/dronest/wiki)_



## Roadmap

See the [open issues](https://github.com/suasllc/dronest/issues) for a list of proposed features (and known issues).



## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## License

Distributed under the MIT License. See `LICENSE` for more information.



## Contact

Tony Ngo [@suas_com](https://twitter.com/suas_com) - website: https://tonyngo.us

Project Link: [https://github.com/suasllc/dronest](https://github.com/suasllc/dronest)



## Acknowledgements

* [App Academy](https://www.appacademy.io/)
* [D. Miller](https://github.com/dbmille2)
* [Unsplash](https://unsplash.com/)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)



[contributors-shield]: https://img.shields.io/github/contributors/suasllc/dronest.svg?style=for-the-badge
[contributors-url]: https://github.com/suasllc/dronest/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/suasllc/dronest.svg?style=for-the-badge
[forks-url]: https://github.com/suasllc/dronest/network/members
[stars-shield]: https://img.shields.io/github/stars/suasllc/dronest.svg?style=for-the-badge
[stars-url]: https://github.com/suasllc/dronest/stargazers
[issues-shield]: https://img.shields.io/github/issues/suasllc/dronest.svg?style=for-the-badge
[issues-url]: https://github.com/suasllc/dronest/issues
[license-shield]: https://img.shields.io/github/license/suasllc/dronest.svg?style=for-the-badge
[license-url]: https://github.com/suasllc/dronest/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/tony-ngo-suas/
