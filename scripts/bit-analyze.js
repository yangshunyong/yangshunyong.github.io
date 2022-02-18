var radix = 16;
var TOTAL_BITS;
var EACH_TABLE_BITS;
var TABLE_NUM;
var COLOR_BLOCK = 8;
var HEX_CHAR_NUM;
var select_started = 0;
var ana_tb_bits = Array(TOTAL_BITS);
var set_tb_bits = Array(TOTAL_BITS);
var tb_0_color = "RGB(255, 255, 255)"
var tb_1_color = "RGB(253, 153, 153)"
var th_even_color = "RGB(200, 200, 255)";
var th_old_color = "RGB(230, 255, 230)";

function build_params(total_bits, each_table_bits) {
    select_started = 0;
    TOTAL_BITS = total_bits;
    EACH_TABLE_BITS = each_table_bits;
    TABLE_NUM = (TOTAL_BITS / EACH_TABLE_BITS);
    ana_tb_bits = Array(total_bits);
    set_tb_bits = Array(total_bits);
    HEX_CHAR_NUM = parseInt((TOTAL_BITS / 4));
}

function remove_table_items(prefix) {
    var table_div = document.getElementById(prefix + "tables");
    table_div.querySelectorAll('*').forEach(n => n.remove());
}

function change_width () {
    switch (event.target.id) {
        case "16bit":
            build_params(16, 16);
            break;
        case "32bit":
            build_params(32, 32);
            break;
        case "64bit":
            build_params(64, 32);
            break;
        case "128bit":
            build_params(128, 32);
            break;
        default:
            break;
    }

    remove_table_items("ana_");
    remove_table_items("set_");
    create_table("ana_", ana_tb_bits, "");
    create_table("set_", set_tb_bits, "handle_tb_click()");
    document.getElementById("input_text").value = "0";
}
function update_select_text(value) {
    var hex_str = "0x" + parseInt(value, 2).toString(radix).toUpperCase();
    var bin_str = value + "B"
    document.getElementById("selected_value").innerHTML = "Selected Value: " + hex_str + ", " + bin_str;
}

function create_table(prefix, tb_bits, callback) {
    var table_div = document.getElementById(prefix + "tables");
    var new_table;
    var new_head_row;
    var new_data_row;
    var tr_header;
    var color_block;

    for (i = TABLE_NUM - 1; i >= 0; i--) {
        /* Create new table */
        new_table = document.createElement("table");
        new_table.setAttribute("id", prefix + "table" + i);

        /* Create new table header row */
        new_head_row = document.createElement("tr");
        new_head_row.setAttribute("id", prefix + "head_row" + i);
        /* Create new table data row */
        new_data_row = document.createElement("tr");
        new_data_row.setAttribute("id", prefix + "data_row" + i);

        for (j = EACH_TABLE_BITS - 1; j >= 0; j--) {
            var curr_bit = i * EACH_TABLE_BITS + j;
            color_block = parseInt(j / COLOR_BLOCK) % 2;

            /* Create MSB table header */
            tr_header = document.createElement("th");
            tr_header.setAttribute("id", "tr_header" + j);
            tr_header.style.backgroundColor = (color_block == 1) ? th_old_color : th_even_color;

            /*tr_header.innerHTML = (j == (EACH_TABLE_BITS - 1)) ?
                "B" + "" + curr_bit : curr_bit;*/
            tr_header.innerHTML = curr_bit;
            if ((curr_bit % 4) == 0) {
                tr_header.style.borderColor = "black green black black";
                if ((curr_bit % 8) == 0) {
                    tr_header.style.borderWidth = "1px 4px 1px 1px";
                } else {
                    tr_header.style.borderWidth = "1px 2px 1px 1px";
                }
            }
            new_head_row.appendChild(tr_header);

            /* Create LSB table data */
            tb_bits[curr_bit] = document.createElement("td");
            tb_bits[curr_bit].setAttribute("id", prefix + curr_bit);
            if ((callback) && (callback.length != 0)) {
                tb_bits[curr_bit].setAttribute("onclick", callback);
            }

            tb_bits[curr_bit].style.borderWidth = "1px";
            if ((curr_bit % 4) == 0) {
                tb_bits[curr_bit].style.borderColor = "black green black black";
                if ((curr_bit % 8) == 0) {
                    tb_bits[curr_bit].style.borderWidth = "1px 4px 1px 1px";
                } else {
                    tb_bits[curr_bit].style.borderWidth = "1px 2px 1px 1px";
                }
            }
            new_data_row.appendChild(tb_bits[curr_bit]);
        }
        new_table.appendChild(new_head_row);
        new_table.appendChild(new_data_row);
        table_div.appendChild(new_table);
    }

    update_table("", tb_bits);
}

function update_table(bits, tb_bits) {
    var valid_bits = bits.length;
    var bit_val;

    for (i = TOTAL_BITS - 1; i >= 0; i--) {
        if (i >= valid_bits) {
            bit_val = "0";
        } else {
            bit_val = bits[valid_bits - i - 1];
        }
        tb_bits[i].innerHTML = bit_val;
        if (bit_val == "1")
            tb_bits[i].style.backgroundColor = tb_1_color;
        else
            tb_bits[i].style.backgroundColor = tb_0_color;
    }
}

function tb_to_bits(tb_bits, start, end) {
    var bits = "";

    for (i = start; i < end; i++) {
        bits = tb_bits[i].innerHTML + bits;
    }

    return bits;
}


function Bits4_to_bits(str) {
    var hex = "";
    var int_input = parseInt(str, 2);

    if (isNaN(int_input)) {
        return "";
    }

    return int_input.toString(16).toUpperCase();
}

function bits_string_to_hex(str) {
    var hex_str = "";
    var padded_length;
    var new_str = "";

    if ((str.length % 4) != 0) {
        padded_length = str.length + 4 - (str.length % 4);
    }

    new_str = str.padStart(padded_length, '0');
    for (i = 0; i < new_str.length; i += 4) {
        hex_str += Bits4_to_bits(new_str.slice(i, i + 4));
    }

    return hex_str;
}

function hex1_to_bits(str) {
    var int_input = parseInt(str, radix);

    if (isNaN(int_input)) {
        return "";
    }

    bits = int_input.toString(2);
    if (isNaN(bits)) {
        return "";
    }

    return bits;
}

function hex_string_to_bits(str, max_length) {
    var bits = "";
    var new_str = str;

    if (str.slice(0, 2) == "0x") {
        new_str = str.slice(2, str.length);
    }

    if (new_str.length > max_length) {
        new_str = new_str.slice(0, max_length);
    }

    for (i = 0; i < new_str.length; i++) {
        var temp = hex1_to_bits(new_str[i]);

        if (temp == "")
            break;
        bits = bits + temp.padStart(4, '0');
    }

    return bits;
}

function copy_to_set() {
    var str_input = document.getElementById("input_text").value;
    bits = hex_string_to_bits(str_input, HEX_CHAR_NUM);
    update_table(bits, set_tb_bits);

    console.log(str_input);
    console.log(bits);
    document.getElementById("set_text").setAttribute("value", str_input);
}

function handle_input() {
    var str_input = document.getElementById("input_text").value;
    var bits = hex_string_to_bits(str_input, HEX_CHAR_NUM);

    bits = bits.padStart(TOTAL_BITS, '0');

    update_table(bits, ana_tb_bits);
    if (select_started == 1) {
        handle_select();
    }
}

function refresh_table(table_bits) {
    var bits = tb_to_bits(table_bits, 0, TOTAL_BITS);
    update_table(bits, table_bits);
}

function handle_select() {
    var str_select = document.getElementById("select_text").value;
    var pos_comma = str_select.indexOf(",");
    var first_str = str_select.slice(0, pos_comma);
    var second_str = str_select.slice(pos_comma + 1, str_select.length);

    first_str = first_str.trim();
    second_str = second_str.trim();

    refresh_table(ana_tb_bits);
    if (pos_comma < 0) {
        return;
    }

    var first_pos = parseInt(first_str);
    if (isNaN(first_pos)) {
        return;
    }

    var second_pos = parseInt(second_str);
    if (isNaN(second_pos)) {
        return;
    }

    /* swap if fist pos larger */
    if (first_pos > second_pos) {
        var temp = first_pos;
        first_pos = second_pos;
        second_pos = temp;
    }

    bits = tb_to_bits(ana_tb_bits, first_pos, second_pos + 1);
    for (i = first_pos; i <= second_pos; i++) {
        ana_tb_bits[i].style.backgroundColor = "RGB(255, 0, 0)";
    }

    update_select_text(bits);

    select_started = 1;
}

function update_set_text(bits) {
    hex_str = bits_string_to_hex(bits);
    document.getElementById("set_text").setAttribute("value", hex_str);
}

function reset_set() {
    var bits = "0";
    update_table(bits, set_tb_bits);
    update_set_text(bits);
}

function handle_tb_click() {
    var tb = document.getElementById(event.target.id);
    var bit_val = tb.innerHTML;
    var hex_str, bits;

    tb.innerHTML = (bit_val == "1") ? "0" : "1";
    refresh_table(set_tb_bits);

    bits = tb_to_bits(set_tb_bits, 0, TOTAL_BITS);
    update_set_text(bits);

    console.log(event.target.id + " clicked");
}

function handle_set_input() {
    console.log("input change");
}
window.onload = function() {
    build_params(64, 32);
    create_table("ana_", ana_tb_bits, "");
    create_table("set_", set_tb_bits, "handle_tb_click()");
}
