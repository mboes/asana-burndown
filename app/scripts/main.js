/*
 * Copyright (C) 2013 Mathieu Boespflug.  All rights reserved.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program. If not, see
 * <http://www.gnu.org/licenses/>.
 */

Create = {
    vary: function(current, amount) {
        return current + amount;
    },
    
    toString: function() {
        return "Created."
    }
}

Complete = {
    vary: function(current, amount) {
        return current - amount;
    },

    toString: function() {
        return "Complete."
    }
}

Event = function Event(date, type, name) {
    this.date = date;
    this.type = type;
    this.name = name;
}

function tabulateEvents(table, events) {
    var current = 0;
    var rows = [];

    events.forEach(function(ev) {
	var result = /\[([0-9]+)\w*.points?\]/.exec(ev.name);
	if (result) {
            current = ev.type.vary(current, parseInt(result[1]));
	    console.dir({"current": current,
			 "type": ev.type.toString(),
			 "name": ev.name,
			 "date": ev.date})
            table.addRow([ev.date, current, ev.name, ev.type.toString()]);
	}
    });
}

function newTable() {
    var table = new google.visualization.DataTable();
    table.addColumn('date', 'Date');
    table.addColumn('number', 'Outstanding tasks');
    table.addColumn('string', 'title1');
    table.addColumn('string', 'text1');

    return table;
}

function drawVisualization(table) {
    var annotatedTimeline =
	new google.visualization.AnnotatedTimeLine(document.getElementById('visualization'));
      annotatedTimeline.draw(table,
			     {'displayAnnotations': true,
			      'thickness': 5,
			      'fill': 50});
}

$(function() {
    var access_token = $.url(true).fparam('access_token');
    $('#messages').text(access_token);

    asana = new Asana(access_token);

    asana.request('/users/me', {}, function(data) {
        $('#output').append("<p>Welcome, " + data.name + ".</p>");
        $('#output').append("<p>Workspaces:<ul>");
        data.workspaces.forEach(function(workspace) {
            $('#output').append("<li>" + workspace.name + "</li>");
        });
        $('#output').append("</ul></p>");
    });

    asana.request('/projects', {}, function(data) {
        [{id: 11451855186816, name: "Test project 1"}].forEach(function(project) {
	//[{"id":8062365496947,"name":"dpH benchmarks"}].forEach(function(project) {
            $('#output').append('<h2 id="project-' + project.id +
                                '">Project: ' + project.name + '</h2>');
            
            asana.request('/projects/' + project.id + "/tasks",
                          {opt_fields: "name,created_at,completed_at"}, function(data) {
                var events = [];
                data.forEach(function(task) {
                    events.push(new Event(new Date(task.created_at), Create, task.name));
                    if (task.completed_at)
                        events.push(new Event(new Date(task.completed_at), Complete, task.name));
                });
                events.sort(function(x, y) {
                    return x.date.getTime() - y.date.getTime();
                });

                var table = newTable();
                tabulateEvents(table, events);
	        drawVisualization(table);
            });
            // asana.request('/projects/' + project.id + "/tasks", {}, function(data) {
            //  $('#project-' + project.id).after("<ul>");
            //  $.each(data, function(i, task) {
            //      $('#project-' + project.id).after("<li>" + task.name + "</li>");
            //  });
            //  $('#project-' + project.id).after("</ul>");
            // });
        });
    });
});
