<?php

// Note: This is a demo only. Don't store emails
// in a text file like this on a real site!

$fp = fopen ('emails.txt', 'a');
fwrite ($fp, $_REQUEST['input'] . "\n");
fclose ($fp);

?>