# JSBOT

A small cli for react that generates a starter boilerplate.
<br>
You can also generate new components with this package. 
<br>
## Install

Run

>```npm install -g jsbot-cli```

You may need to ```sudo``` it.
## Why?

The jsbot cli has no actual structure and I noticed that when I start a project almost everytime I needed a router,state-management (redux, I choose mobx - in the future maybe a redux flag to generate with redux) and 
sass (who doesn't love Sass right?!).

And the second reason was that I had to manually copy-paste the code when I wanted to create a component. 
It is time consuming and redudant. 

You can generate two components: [Functional and Class Components](https://facebook.github.io/react/docs/components-and-props.html#functional-and-class-components) :

Functional Component:


```javascript
import React, {Component} from 'react';
import PropTypes from 'prop-types';

const Comp = () => {
  return (
    <div className="Comp">
    </div>
  )
}
Comp.propTypes = {
}

export default Comp;
```  

Class Component:

```javascript
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Comp extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="Comp">
    
      </div>
    )
  }
}
Comp.propTypes = {
}

export default Comp; 
```

You can generate these files anywhere. If it detects that the project directory has a ./src/components directory it will choose to generate them there.

### Initialize project

Run

>```jsbot create <ProjectName>```

This will ask you what project you want to inialize, a new project with the boilerplate in place with following project structure : <br>
```
project
└─ node_modules
└─ public
└─ src
│   └─ Assets
│   │   │ logo.png 
│   │   └─ styles
│   │   └─ images
│   └─ Components
│   │   └─ loader
│   │   │    │ index.js
│   │   └─ home
│   │   │    │ actions.js
│   │   │    │ constants.js
│   │   │    │ index.js
│   │   │    │ reducer.js
│   └─ Containers
│   │    └─ Homepage
│   │    │   │ index.js
│   └─ Reducers
│   │    │ index.js
│   └─ Store
│   │    │ index.js
│   │ App.js
│   │ App.css
│   │ App.test.js
│   │ index.js
│   │ index.css
│ .gitignore
│ LICENSE
│ package.json  
│ package-lock.json  
│ README.md 
```
currently react project in working and soon other project will come too.

### Generate Component
Run
>```jsbot gc <ComponentName>```

This will create a folder of your component name, and a class component js file of the same name.
You can also give paths to the component name for example :
>```jsbot gc component/comp1``` => will create a component within the component folder (and make it if it doesn't exist). 
#### Options
Create a functional component
>```jsbot gc <ComponentName> -f``` <b>or</b> ```jsbot gc <ComponentName> --functional```

Create a component without style css file
>```jsbot gc <ComponentName> -s``` <b>or</b> ```jsbot gc <ComponentName> --nostyle```

Create a component without redux
>```jsbot gc <ComponentName> -r``` <b>or</b> ```jsbot gc <ComponentName> --noredux```

Create a component but don't wrap it in a folder
>```jsbot gc <ComponentName> -n``` <b>or</b> ```jsbot gc <ComponentName> --nofolder```



<br>
ENJOY!
