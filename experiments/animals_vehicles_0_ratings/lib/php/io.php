
<?php
   $json = $_POST['json'];

   $file = fopen('../../data/final/dissimratings.json','w+');
  fwrite($file, $json);
  fclose($file);

?>
