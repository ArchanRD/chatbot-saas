This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup DB using docker
- First [Install docker](https://www.docker.com/)

- Install [docker-compose](https://docs.docker.com/compose/install/).

After docker installation:

Open terminal and cd to project's root directory. Execute the following commands to create a container:

```
docker-compose up -d
```

Check if the container is created:
```
docker ps -a
```
Check if the container is running:
```
docker ps
```

To get access into the container:
```
docker exec -it <container_id> sh
```
container id can be found by running `docker ps`. It will list the container running and it's id.

After getting into container, login to psql db:
```
psql -U postgres -d conversy
```

### common postgres commands
1. \l - list databases
2. \dt - list all the relations
3. To list data of a table:
   
   Select * from <table_name>;
