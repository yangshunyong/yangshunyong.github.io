var EACH_TABLE_NAME = 10;
var CFG_TH_COLOR = "RGB(117, 165, 213)";

var g_current_group = -1;
var g_user_choice = 0;
var dots_str = "";
var g_total_names;
var g_each_table_names;
var g_table_num;
var select_started = 0;
var g_ana_tb_names = Array(g_total_names);
var g_all_names="白曹蔡程崔邓董杜丁段戴冯范付方郭高顾龚陈黄胡何韩侯贺郝蒋姜金贾江孔李刘林罗梁吕卢陆廖雷龙黎马孟毛莫彭潘秦邱钱覃任孙宋苏沈石史邵唐田谭陶汤王吴魏汪韦万武徐谢许肖夏熊薛向杨袁于余叶姚尹闫严张赵周朱郑曾钟邹"
var g_max_group = Math.floor(Math.log2(g_all_names.length)) + 1;

function build_params(total_names, each_table_names) {
    g_select_started = 0;
    g_total_names = total_names;
    g_each_table_names = each_table_names;
    g_table_num = (g_total_names / g_each_table_names);
    g_ana_tb_names = Array(total_names);
    g_hex_char_num = parseInt((g_total_names / 4));
}

function get_name(idx) {
    return g_all_names.substring(idx, idx + 1)
}

function create_table(prefix, tb_names) {
    var table_div = document.getElementById(prefix + "tables");
    var new_table;
    var new_data_row;
    var tr_header;
    var color_block;

    for (i = 0; i < g_table_num; i++) {
        /* Create new table */
        new_table = document.createElement("table");
        new_table.setAttribute("id", prefix + "table" + i);

        /* Create new table data row */
        new_data_row = document.createElement("tr");
        new_data_row.setAttribute("id", prefix + "data_row" + i);

        /* Create new table header row */
        new_head_row = document.createElement("tr");
        new_head_row.setAttribute("id", prefix + "head_row" + i);



        for (j = 0; j < g_each_table_names; j++) {
            var curr_bit = i * g_each_table_names + j;

                    /* Create MSB table header */
            tr_header = document.createElement("th");
            tr_header.setAttribute("id", "tr_header" + j);
            tr_header.innerHTML = i * g_each_table_names + j;
            tr_header.style.backgroundColor = CFG_TH_COLOR;
            new_head_row.appendChild(tr_header);

            /* Create LSB table data */
            tb_names[curr_bit] = document.createElement("td");
            tb_names[curr_bit].setAttribute("id", prefix + curr_bit);
            tb_names[curr_bit].style.borderWidth = "1px";
            new_data_row.appendChild(tb_names[curr_bit]);
        }
        new_table.appendChild(new_head_row);
        new_table.appendChild(new_data_row);
        table_div.appendChild(new_table);
    }
    update_table(tb_names, -1);
}

function update_table(tb_names, bit_num) {
    var i;
    var mask;

    if (bit_num < 0) {
        mask = -1;
    } else {
        mask = 1 << bit_num;
    }

    for (i = 0; i < g_total_names; i++) {
            tb_names[i].innerHTML = "";
    }

    for (i = 0; i < g_total_names; i++) {
        if ((i + 1) & (mask)) {
            tb_names[i].innerHTML = get_name(i);
        } 
    }
}


function update_choice() {
    var p_choice = document.getElementById("choice_text");
    var name = get_name(g_user_choice - 1);

    if ((g_current_group < g_max_group) || (name.length == 0)) {
        dots_str += ".";
        p_choice.innerHTML = "您的姓氏：" + dots_str + "?"
        p_choice.style.color = "black"
    } else {
        dots_str =""
        p_choice.innerHTML = "您的姓氏：" + name + "!!!!"
        p_choice.style.color = "red"
    }
}

function click_have_name() {
    if (g_current_group >= 0) {
        g_user_choice |= 1 << (g_current_group);
    }
    
    if (g_current_group < g_max_group) {
        g_current_group++;
        update_table(g_ana_tb_names, g_current_group);
    }
    update_choice();
    console.log("have name");
}

function click_no_name() {
    if (g_current_group < 0) {
        return;
    }
    if (g_current_group < g_max_group) {
        g_current_group++;
        update_table(g_ana_tb_names, g_current_group);
    }
    update_choice();
    console.log("no name");
}

function reset_game() {
    location.reload();
}

window.onload = function() {
    build_params(g_all_names.length, EACH_TABLE_NAME);
    create_table("ana_", g_ana_tb_names, "");
}
