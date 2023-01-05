// CSS for table.
const styled_table = {
    'border-collapse': 'collapse',
    'margin': '25px 0',
    'font-size': '0.9em',
    'font-family': 'sans-serif',
    'min-width': '400px',
    'box-shadow': '0 0 20px rgba(0, 0, 0, 0.15)'
}

// Dynamically append team and position dropdown to popup.html.
const teams = 
['ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 'DAL', 'DEN', 'DET', 'GB', 'HOU', 
'IND', 'JAX', 'KC', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 'NYJ', 'LV', 'PHI', 'PIT', 'LAC', 'SF', 
'SEA', 'LAR', 'TB', 'TEN', 'WAS']

const teams_options = teams.map((team) => {
    return '<option value=' + team + '>' + team + '</option>'
})

const positions = ['WR', 'RB', 'QB', 'TE', 'K', 'DST']

const positions_options = positions.map((pos) => {
    return '<option value=' + pos + '>' + pos + '</option>'
})

$(document).ready(function(){
    $('body').append('<div class="jq"></div>')
    $('.jq').append(
        '<div>' +
            '<form id="form">' + 
            '<label id="label1" for="team">Choose team:' +
            '</label>' +
            '<label id="label2" for="position">Choose position: </label>' +
            '<button type="submit" id="getInfo">Get data</button>' +
            '<button type="button" id="uploadData">Upload data</button>' +
            '</form>' +
        '</div>'
    )

    let $select = $('<select id="team">')
    for (let i=0; i<teams_options.length; i++){
        $select.append(teams_options[i])
    }
    $('#label1').append($select)

    let $select2 = $('<select id="position">')
    for (let i=0; i<positions_options.length; i++) {
        $select2.append(positions_options[i])
    }
    $('#label2').append($select2)

  });

let arr = []
let final_arr = []

// Get fantasy stats.
async function getStats(e) {
    e.preventDefault()

    if(final_arr.length>0){
    arr = []
    final_arr = []
    }

    const team = e.target.team.value
    const pos = e.target.position.value
    let num_columns

    if(pos === 'QB' | pos === 'DST'){
        num_columns = 14
    }
    else if(pos === 'K'){
        num_columns = 10
    }
    else {num_columns = 13}

    let url = 'https://www.cbssports.com/fantasy/football/stats/posvsdef/' + pos + '/' + team + '/teambreakdown/standard'

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'html',
        timeout: 4000,
        cache: false,
        error: function(request, status, error){ alert('Error'); },
        success: function(html){
            let $html = $(html)
            let table = $html.find('tr:not([id*=hidden])')
            table.each((i, ele) => {
                $(ele).children().each((ind, el) => {
                    if(i>1){
                        arr.push($(el).text())
                    }
                })
            }
            )
            const num_weeks = arr.length / num_columns

            for(let i=0;i<num_weeks;i++){
                let arr_to_slice = arr.slice(i*num_columns, (i+1)*num_columns)
                final_arr.push(arr_to_slice)
            }
        }
    })


}

// Add event listener for submit
setTimeout(() => {
    const form = document.getElementById('form')
    form.addEventListener('submit', (e) => getStats(e))
}, 1000)

// Create table when form is submitted.
$(document).on('click', '#uploadData', () => {

    setTimeout(() => {
        $('.jq-table').remove()

        let $table = $('<table class="jq-table">').css(styled_table)

        for(let i=0; i<final_arr.length; i++){
            let $row = $('<tr>')
            for (let j=0; j<final_arr[i].length; j++) {
                let $cell = $('<td>').text(final_arr[i][j])
                $row.append($cell)
            }
            $table.append($row)
        }
        $('.jq').append($table).css('font-size', '60%')
    }, 1000)
})