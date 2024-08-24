<?php
// code to display the library

makeHeader();
makeBody();

function makeHeader()
{
    echo <<< EOT
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta name="description" content="Tennessee Game Days Fall: Extra Gaming for Extra Life is an open gaming convention held annually in Nashville, TN with all proceeds benefiting the Monroe Carrell Jr. Children's Hospital at Vanderbilt." />
<meta name="keywords" content="Tennessee Game Days" />
<meta name="author" content="Devon Weller" />
<link rel="stylesheet" type="text/css" href="styles.css" media="screen" title="styles (screen)" />
<link rel="stylesheet" type="text/css" href="print.css" media="print" />
<link rel="alternate" type="application/rss+xml" title="TN Game Days Current News and Updates" href="/blog/feed/" />
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/jquery.innerfade.js"></script>
<title>Tennessee Game Days - Library</title>
</head>
EOT;
}

function gameSort($a, $b)
{
    return strcmp($a["boardGameGeekThing"]["itemName"], $b["boardGameGeekThing"]["itemName"]);
}

function makeBody()
{
    print "<body>\n<input id=\"search\" type=\"text\" name=\"search\" placeholder=\"Search...\" />";
    print "<input type=\"checkbox\" checked=\"true\" id=\"show-images\" name=\"images\" value=\"images\" /><label for=\"images\">Images</label>\n";
    $url="https://tennessee-game-days-admin.vercel.app/api/library/list";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $resp = curl_exec($ch);
    $foo = json_decode($resp, true);
    $foo = $foo["list"];
    usort($foo, "gameSort");
    print "<table>\n";
    $items = 0;
    $itemsPerRow = 3;
    $first = 1;
    foreach ($foo as $item)
    {
        if (0 == ($items % $itemsPerRow))
        {
            if (1 <> $first)
            {
                print "</tr>";
            }
            print "<tr>";
            $first = 0;
        }
        print "<td class=\"game\">";
        print "<img src=\"".$item['boardGameGeekThing']['thumbnailUrl']."\" /><br />";
        print ($items+1).": ".$item['boardGameGeekThing']['itemName'];
        print "</td>\n";
        $items++;
    }
    if (0 <> ($items % $itemsPerRow))
    {
        print "</tr>\n";
    }
    print "</table>\n</body>\n</html>";
}

?>

<script type="text/javascript">
    document.addEventListener("DOMContentLoaded", function() {
        const searchInput = document.getElementById("search");
        const imagesCheckbox = document.getElementById("show-images");
        const rows = document.querySelectorAll("table tr");

        function filterGames() {
            const query = searchInput.value.toLowerCase();
            rows.forEach(row => {
                let match = false;
                row.querySelectorAll("td.game").forEach(td => {
                    const gameName = td.textContent.toLowerCase();
                    if (gameName.includes(query)) {
                        match = true;
                    }
                });
                row.style.display = match ? "" : "none";
            });
        }

        function toggleImages() {
            const showImages = imagesCheckbox.checked;
            document.querySelectorAll(".game img").forEach(img => {
                img.style.display = showImages ? "inline" : "none";
            });
        }

        searchInput.addEventListener("input", filterGames);
        imagesCheckbox.addEventListener("change", toggleImages);

        // Initial toggle of images based on checkbox
        toggleImages();
    });
</script>
