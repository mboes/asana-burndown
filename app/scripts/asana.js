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

Asana = function Asana(access_token) {
    this.access_token = access_token;
}

Asana.prototype = {
    API_VERSION: "1.0",

    host: "app.asana.com",

    baseApiUrl: function() {
	return "https://" + this.host + '/api/' + this.API_VERSION;
    },

    request: function(path, params, callback) {
	var url = this.baseApiUrl() + path;
	
	var attrs = {
	    dataType: "json",
	    cache: true,
	    url: url,
	    data: params,
	    headers: {
		"Authorization": "Bearer " + this.access_token
	    },
	    success: function(data, status, xhr) {
		callback(data.data);
	    }
	};

	$.ajax(attrs);
    }
}

