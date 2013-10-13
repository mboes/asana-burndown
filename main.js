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

$(function() {
    var access_token = $.url(true).fparam('access_token');
    $('#messages').text(access_token);

    asana = new Asana(access_token);

    asana.request('/users/me', { opt_fields: "name,workspaces"}, function(data) {
	$('#output').text("Welcome, " + data.name + "." + data.workspaces);
    });
});
