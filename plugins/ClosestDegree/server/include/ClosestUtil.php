<?php

class ClosestUtil {

    public function slopePoints($x1, $y1, $x2, $y2) {
        if ($x2 == $x1)
            return INF;
        if ($y2 == $y1)
            return 0;
        $dy = $y2 - $y1;
        $dx = $x2 - $x1;
        return floatval(floatval(dy) / floatval(dx));
    }

    public function slope($z1, $z2, $distance) {
        if ($distance == 0) {
            return INF;
        };
        return (1.0 * ($z2 - $z1)) / $distance;
    }

    public function distance($x1, $y1, $x2, $y2) {
        return sqrt(pow(($x2 - $x1), 2) + pow(($y2 - $y1), 2));
    }

    public function pointProfile($x1, $y1, $angle, $rotAngle, $r1, $r2=null) {
        if ($r2 == null) {
            $r2 = $r1;
        };
        $xo = $r1 * cos($angle);
        $yo = $r2 * sin($angle);
        $xrot = $xo * cos($rotAngle) + $yo * sin($rotAngle);
        $yrot = -$xo * sin($rotAngle) + $yo * cos($rotAngle);
        // die;
        $x = $x1 + $xrot;
        $y = $y1 + $yrot;
        return array($x, $y);
    }

    public function rotatePoint($x1, $x2, $rotangle=0) {
        $x = $x1 * cos($rotangle) + $y1 * sin($rotangle);
        $y = -$x1 * sin($rotangle) + $y1 * cos($rotangle);
        return array($x, $y);
    }

}
?>
