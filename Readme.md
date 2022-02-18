#### Express API key authentication middleware

##### In postman or other API testing tool add your api_key to header. example given below

```yaml
{
    key: api_key, 
    value: <Your API key value>, 
    add to: Header
}
```

##### Run application

```yaml
npm start
```

##### API Endpoints

```yaml
http://localhost:4000
```

```yaml
http://localhost:4000/my-app-key
```
