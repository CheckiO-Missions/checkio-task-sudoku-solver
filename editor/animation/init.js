//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            var checkioInput = data.in;

            if (data.error) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.output').html(data.error.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return false;
            }

            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_addon = data.ext["result_addon"];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            var canvas = new SudokuCanvas();
            canvas.createCanvas($content.find(".explanation")[0], checkioInput, rightResult);
            if (result) {
                $content.find('.call').html('Pass: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.output').html('&nbsp;Your result is correct:&nbsp;');
                $content.find('.output-explanation').remove();
                $content.find('.answer').remove();
            }
            else {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.call').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.answer').addClass('error');
                $content.find('.answer').html('Right result:');
                if (isSudoku(userResult)) {
                    $content.find('.output').html('&nbsp;Your result is wrong:');
                    var uCanvas = new SudokuCanvas();
                    uCanvas.createCanvas($content.find(".output-explanation")[0], checkioInput, userResult);
                }
                else {
                    $content.find('.output').html('&nbsp;Your result:<br>' +
                        JSON.stringify(userResult));
                    $content.find('.output-explanation').remove();

                }
            }

            this_e.setAnimationHeight($content.height() + 60);

        });

        function isSudoku(matrix) {
            var L = 9;
            if (!Array.isArray(matrix) || matrix.length != L) {
                return false;
            }
            for (var i = 0; i < L; i++) {
                var row = matrix[i];
                if (!Array.isArray(row) || row.length != L) {
                    return false;
                }
                for (var j = 0; j < L; j++) {
                    var el = Number(row[j]);
                    if (isNaN(el) || el < 1 || el > 9 || Math.floor(el) != el) {
                        return false;
                    }
                }
            }
            return true;
        }

        function SudokuCanvas(options) {

            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            options = options || {};

            var cell = options['cell'] || 30;
            var padding = options['padding'] || 10;
            var N = 9;

            var fullSize = padding * 2 + cell * N;


            var paper;

            var attrRect = {"stroke": colorBlue4, "stroke-width": 1};
            var attrBigRect = {"stroke": colorBlue4, "stroke-width": 2};
            var attrTextStart = {"stroke": colorBlue4, "font-family": "Verdana", "font-size": cell * 0.8};
            var attrTextNew = {"stroke": colorOrange4, "fill": colorOrange4, "font-family": "Verdana", "font-size": cell * 0.8};

            this.createCanvas = function (dom, template, solved) {
                var paper = Raphael(dom, fullSize, fullSize, 0, 0);
                for (var i = 0; i < N; i++) {
                    paper.rect(
                        padding + cell * 3 * (i % 3),
                        padding + cell * 3 * Math.floor(i / 3),
                        cell * 3,
                        cell * 3
                    ).attr(attrBigRect);
                }
                for (var row = 0; row < N; row++) {
                    for (var col = 0; col < N; col++) {
                        paper.rect(
                            padding + cell * col,
                            padding + cell * row,
                            cell,
                            cell
                        ).attr(attrRect);
                        paper.text(
                            padding + cell * col + cell / 2,
                            padding + cell * row + cell / 2,
                            solved[row][col]
                        ).attr(template[row][col] ? attrTextStart : attrTextNew);
                    }
                }
            }

        }


    }
);
