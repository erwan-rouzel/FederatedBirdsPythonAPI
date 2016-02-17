import MySQLdb

class MySQLStore:
    """ Mysql Data accessor """
    def __init__(self, config, logger):
        self.config = config
        self.logger = logger
    def __str__(self):
        return "MySQLStore " + str(self.config)

    def close(self):
        if self.connection:
            self.connection.close()

    def users(self, start, end):
        res = self._query("select handle from users order by created_at asc", start, end)
        return res

    def followers(self, handle, start, end):
        res = self._query("select followers_users.handle, followings.created_at from users inner join followings on users.id = followings.who_id and followings.who_type = 'User' inner join users followers_users on followers_users.id = followings.user_id where users.handle = %s order by created_at asc", handle, start, end)
        return res

    def followings(self, handle, start, end):
        res = self._query("select users.handle, followings.created_at from users inner join followings on users.id = followings.who_id and followings.who_type = 'User' inner join users followers_users on followers_users.id = followings.user_id where followers_users.handle = %s order by created_at asc", handle, start, end)
        return res

    def create_following(self, followed_handle, handle, created_at):
        user = self.get_user_by_handle(handle)
        if user is None:
            return False
        followed = self.get_user_by_handle(followed_handle)
        if followed is None:
            return False
        self._query("insert into followings (user_id, who_id, who_type, created_at, updated_at) values (%s, %s, 'User', %s, %s);", user[4], followed[4], created_at, created_at, paginate=False)
        return True

    def delete_following(self, followed_handle, handle):
        self._query("delete followings from followings inner join users on users.id = followings.user_id inner join users followed_users on followed_users.id = followings.who_id and followings.who_type= 'User' where users.handle = %s and followed_users.handle = %s ", handle, followed_handle, paginate=False)
        return True

    
    def get_user_by_handle(self, handle):
        res = self._query("select handle, password, token, created_at, id from users where handle = %s", handle, 0, 1)
        return res[0] if len(res) > 0 else None

    def create_user(self, handle, password, token, created_at):
        self._query("insert into users (handle, password, token, created_at, updated_at) values (%s, %s, %s, %s ,%s);", handle, password, token, created_at, created_at, paginate=False)
        return True

    def create_tweet(self, content, handle, created_at):
        user = self.get_user_by_handle(handle)
        if user is None:
            return False
        self._query("insert into tweets (content, user_id, created_at, updated_at) values (%s, %s, %s ,%s);", content, user[4], created_at, created_at, paginate=False)
        return True

    def reading_list(self, handle, start, end):
        query = "select content, users.handle, tweets.created_at from tweets inner join users on users.id = tweets.user_id inner join followings on users.id = followings.who_id and followings.who_type = 'User' inner join users followers_users on followers_users.id = followings.user_id where followers_users.handle = %s order by created_at desc"
        return self._query(query, handle, start, end)

    def tweets(self, handle, start, end):
        query = "select content, users.handle, tweets.created_at from tweets inner join users on users.id = tweets.user_id %s order by created_at desc"
        if handle is None:
            res = self._query(query % "", start, end)
        else:
            res = self._query(query % "where users.handle = %s", handle, start, end)
        return res

    def _query(self, query, *args, paginate=True):
        cur = self._connect().cursor()
        if paginate:
            query += " limit %s, %s"
        self.logger.debug("%s args: %s",  query, repr(args))
        cur.execute(query, args)
        return cur.fetchall()

    def _connect(self):
        if not hasattr(self, 'connection'):
            self.connection = MySQLdb.connect(**self.config)
            self.connection.autocommit(True)
            self._init_db()
        return self.connection

    def _init_db(self):
        tables = {x[0] for x in self._query("show tables", paginate=False)}
        if {'followings', 'tweets', 'users'} <= tables:
            return
        self.logger.debug("Initializing tables;")
        structure= """
        DROP TABLE IF EXISTS `followings`;
        CREATE TABLE `followings` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `user_id` int(11) DEFAULT NULL,
          `who_id` int(11) DEFAULT NULL,
          `who_type` varchar(255) DEFAULT NULL,
          `created_at` datetime DEFAULT NULL,
          `updated_at` datetime DEFAULT NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


        DROP TABLE IF EXISTS `tweets`;
        CREATE TABLE `tweets` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `user_id` int(11) DEFAULT NULL,
          `content` varchar(255) DEFAULT NULL,
          `created_at` datetime DEFAULT NULL,
          `updated_at` datetime DEFAULT NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

        DROP TABLE IF EXISTS `users`;
        CREATE TABLE `users` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `handle` varchar(255) DEFAULT NULL,
          `password` varchar(255) DEFAULT NULL,
          `token` varchar(255) DEFAULT NULL,
          `created_at` datetime DEFAULT NULL,
          `updated_at` datetime DEFAULT NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
        """
        c = self._connect().cursor()
        c.execute(structure)
