# EPFBOOK by BOTCHEV Martin
## Description of the application
This application is a social website for students.
There are several fonctionalities in this social website:
- You can see all the the students with their school
- You can add new students
- You can see the details of each student and modify their informations
- You can also see data about students such as what were their stress busters during the lockdown or if they had some health issues

Now lets see how you can use this application on o-your own laptop

## Installation

First you have to clone the folder on git to do this you have to go in your terminal and you use this :

```
git clone https://github.com/EPF-MDE/MMMDE4IN19-22-BOYTCHEV-Martin.git
```

Normaly now you have the file in your computer so you can navigate to you faile using :

```
cd <repo-name>
```

Now you are in the good folder you need ton install a npm. Npm (Node Package Manager) is the default package manager for the Node.js JavaScript development environment, to install it you have to do :

```
npm install
```
Now you have the npm.
To run the code you now need to do :
```
npm run dev
```
Now you application should work and you should see a message like that in your terminal :
```
*Example app listening on http://localhost:3000*
```

If you have this everything is good you can now go in your browser and type the URL you have above. You should be in the first page of our website.


## Consume an existing API

In this little exercise we need need to consume an existing API which is https://rickandmortyapi.com/api/ to find a character to do that we can use Insomnia to do a request GET to get the character with the id 5.
We open Insomnia and we create a Get request and we put this URL https://rickandmortyapi.com/api/character/5 and we get that, to find the good URL we need to go in the documentation of the API to know how to communicate with it :

```
{
	"id": 5,
	"name": "Jerry Smith",
	"status": "Alive",
	"species": "Human",
	"type": "",
	"gender": "Male",
	"origin": {
		"name": "Earth (Replacement Dimension)",
		"url": "https://rickandmortyapi.com/api/location/20"
	},
	"location": {
		"name": "Earth (Replacement Dimension)",
		"url": "https://rickandmortyapi.com/api/location/20"
	},
	"image": "https://rickandmortyapi.com/api/character/avatar/5.jpeg",
	"episode": [
		"https://rickandmortyapi.com/api/episode/6",
		"https://rickandmortyapi.com/api/episode/7",
		"https://rickandmortyapi.com/api/episode/8",
		"https://rickandmortyapi.com/api/episode/9",
		"https://rickandmortyapi.com/api/episode/10",
		"https://rickandmortyapi.com/api/episode/11",
		"https://rickandmortyapi.com/api/episode/12",
		"https://rickandmortyapi.com/api/episode/13",
		"https://rickandmortyapi.com/api/episode/14",
		"https://rickandmortyapi.com/api/episode/15",
		"https://rickandmortyapi.com/api/episode/16",
		"https://rickandmortyapi.com/api/episode/18",
		"https://rickandmortyapi.com/api/episode/19",
		"https://rickandmortyapi.com/api/episode/20",
		"https://rickandmortyapi.com/api/episode/21",
		"https://rickandmortyapi.com/api/episode/22",
		"https://rickandmortyapi.com/api/episode/23",
		"https://rickandmortyapi.com/api/episode/26",
		"https://rickandmortyapi.com/api/episode/29",
		"https://rickandmortyapi.com/api/episode/30",
		"https://rickandmortyapi.com/api/episode/31",
		"https://rickandmortyapi.com/api/episode/32",
		"https://rickandmortyapi.com/api/episode/33",
		"https://rickandmortyapi.com/api/episode/35",
		"https://rickandmortyapi.com/api/episode/36",
		"https://rickandmortyapi.com/api/episode/38",
		"https://rickandmortyapi.com/api/episode/39",
		"https://rickandmortyapi.com/api/episode/40",
		"https://rickandmortyapi.com/api/episode/41",
		"https://rickandmortyapi.com/api/episode/42",
		"https://rickandmortyapi.com/api/episode/43",
		"https://rickandmortyapi.com/api/episode/44",
		"https://rickandmortyapi.com/api/episode/45",
		"https://rickandmortyapi.com/api/episode/46",
		"https://rickandmortyapi.com/api/episode/47",
		"https://rickandmortyapi.com/api/episode/48",
		"https://rickandmortyapi.com/api/episode/49",
		"https://rickandmortyapi.com/api/episode/50",
		"https://rickandmortyapi.com/api/episode/51"
	],
	"url": "https://rickandmortyapi.com/api/character/5",
	"created": "2017-11-04T19:26:56.301Z"
}
```

The character with the id 5 is Jerry Smith
