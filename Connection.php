<?php
class Connection
{
    public function __construct()
    {

    }

    public function getPDOConnection()
    {

        $dsn = 'mysql:host=edu-mysql.du.se;dbname=db-h17evdah';
        $user = 'h17evdah';
        $pass = 'JeyTMj8A53zZjXdA';

        $options = array(
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
        );
        try
        {

            $pdoConnection = new PDO($dsn, $user, $pass, $options);

        }
        catch(PDOException $exp)
        {
            echo 'Något gick fel, försök igen: ', $exp->getMessage();
            $pdoConnection = NULL;
            die();
        }
        return $pdoConnection;
    }

}

?>
