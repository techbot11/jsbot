
import axios from 'axios';
const ExampleService = {
  ExampleServiceExample: () => {
      const url = ''; // api url goes here
      return axios({
          url,
          method: "GET",
          data: '', // data values
          params: '', // queryString key: value pair
      })
  }
}

export default ExampleService
