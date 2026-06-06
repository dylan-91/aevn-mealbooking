const SHEET_NAMES = {
  employees: 'employees',
  udc: 'udc',
  shifts: 'shifts',
  meals: 'meals',
  menus: 'menus',
  ordered: 'ordered',
  orders: 'orders'
};

const SYNCABLE_SHEETS = ['employees', 'udc', 'shifts', 'meals', 'menus'];

const ORDERED_HEADERS = ['epcode', 'week', 'year', 'date'];
const ORDERS_HEADERS = ['epuid', 'epfullname', 'dpcode', 'dpname', 'date', 'orderdate', 'shcode', 'shiftname', 'mlcode', 'mlname', 'mlev04', 'mncode', 'mnname'];

function doGet(e) {
  try {
    const action = normalizeText(e.parameter.action).toLowerCase();

    if (action === 'bootstrap') {
      return jsonResponse(handleBootstrap());
    }

    if (action === 'login') {
      const epcode = normalizeCode(e.parameter.epcode || e.parameter.msnv);
      const eppasswd = normalizeText(e.parameter.eppasswd || e.parameter.password || e.parameter.passwd);
      return jsonResponse(handleLogin(epcode, eppasswd));
    }

    return jsonResponse({ success: false, message: 'Unsupported action' });
  } catch (error) {
    return jsonResponse({ success: false, message: String(error && error.message ? error.message : error) });
  }
}

function doPost(e) {
  try {
    const body = parseBody(e && e.postData ? e.postData.contents : '');
    const action = normalizeText(body.action).toLowerCase();

    if (action === 'syncmasterdata') {
      return jsonResponse(handleSyncMasterData(body));
    }

    if (action === 'submit') {
      return jsonResponse(handleSubmit(body));
    }

    return jsonResponse({ success: false, message: 'Unsupported action' });
  } catch (error) {
    return jsonResponse({ success: false, message: String(error && error.message ? error.message : error) });
  }
}

function handleBootstrap() {
  const ss = getWorkbook();
  const registration = getNextWeekWindow();

  return {
    success: true,
    registrationWindow: registration,
    shifts: readSheetObjects(ss, SHEET_NAMES.shifts).map((r) => ({
      code: normalizeCode(r.shcode),
      name: normalizeText(r.shname)
    })).filter((r) => r.code),
    meals: readSheetObjects(ss, SHEET_NAMES.meals).map((r) => ({
      code: normalizeCode(r.mlcode),
      name: normalizeText(r.mlname),
      mlev04: normalizeCode(r.mlev04),
      isOvertime: isYesValue(r.mnev04) || isYesValue(r.mlev04)
    })).filter((r) => r.code),
    menus: readSheetObjects(ss, SHEET_NAMES.menus).map((r) => ({
      code: normalizeCode(r.mncode),
      name: normalizeText(r.mnname)
    })).filter((r) => r.code),
    udc: readSheetObjects(ss, SHEET_NAMES.udc).map((r) => ({
      udcode: normalizeCode(r.udcode),
      shcode: normalizeCode(r.shcode),
      mlcode: normalizeCode(r.mlcode),
      mncode: normalizeCode(r.mncode)
    })).filter((r) => r.udcode)
  };
}

function handleLogin(epcode, eppasswd) {
  if (!epcode || epcode.length < 4) {
    return { success: false, message: 'Mã nhân viên phải có ít nhất 4 ký tự' };
  }

  if (!eppasswd) {
    return { success: false, message: 'Vui lòng nhập mật khẩu' };
  }

  const ss = getWorkbook();
  const employees = readSheetObjects(ss, SHEET_NAMES.employees);
  const employee = employees
    .map((r) => ({
      code: normalizeCode(r.epuid),
      password: normalizeText(r.eppasswd),
      name: normalizeText(r.epfullname),
      dpcode: normalizeText(r.dpcode),
      dpname: normalizeText(r.dpname)
    }))
    .find((r) => r.code === epcode);

  if (!employee) {
    return { success: false, message: 'Sai mã nhân viên hoặc mật khẩu' };
  }

  if (employee.password !== normalizeText(eppasswd)) {
    return { success: false, message: 'Sai mã nhân viên hoặc mật khẩu' };
  }

  const registration = getNextWeekWindow();
  const ordered = readSheetObjects(ss, SHEET_NAMES.ordered);
  const alreadyRegistered = ordered.some((r) => {
    return normalizeCode(r.epcode) === epcode
      && Number(r.week) === Number(registration.week)
      && Number(r.year) === Number(registration.year);
  });

  return {
    success: true,
    employee: employee,
    alreadyRegistered: alreadyRegistered,
    registrationWindow: registration
  };
}

function handleSubmit(payload) {
  const epcode = normalizeCode(payload.epcode);
  if (!epcode || epcode.length < 4) {
    return { success: false, message: 'Mã nhân viên không hợp lệ' };
  }

  const entries = Array.isArray(payload.entries) ? payload.entries : [];
  if (entries.length === 0) {
    return { success: false, message: 'Không có dữ liệu đăng ký' };
  }

  const ss = getWorkbook();
  const registration = getNextWeekWindow();
  const week = Number(registration.week);
  const year = Number(registration.year);

  const employees = readSheetObjects(ss, SHEET_NAMES.employees);
  const employee = employees
    .map((r) => ({
      code: normalizeCode(r.epuid),
      name: normalizeText(r.epfullname),
      dpcode: normalizeText(r.dpcode),
      dpname: normalizeText(r.dpname)
    }))
    .find((r) => r.code === epcode);

  if (!employee) {
    return { success: false, message: 'Không tìm thấy nhân viên' };
  }

  const orderedRows = readSheetObjects(ss, SHEET_NAMES.ordered);
  const registered = orderedRows.some((r) => {
    return normalizeCode(r.epcode) === epcode
      && Number(r.week) === week
      && Number(r.year) === year;
  });

  if (registered) {
    return { success: false, message: 'Bạn đã đăng ký tuần này rồi' };
  }

  const shifts = readSheetObjects(ss, SHEET_NAMES.shifts).map((r) => ({
    code: normalizeCode(r.shcode),
    name: normalizeText(r.shname)
  })).filter((r) => r.code);
  const meals = readSheetObjects(ss, SHEET_NAMES.meals).map((r) => ({
    code: normalizeCode(r.mlcode),
    name: normalizeText(r.mlname),
    mlev04: normalizeCode(r.mlev04),
    isOvertime: isYesValue(r.mnev04) || isYesValue(r.mlev04)
  })).filter((r) => r.code);
  const menus = readSheetObjects(ss, SHEET_NAMES.menus).map((r) => ({
    code: normalizeCode(r.mncode),
    name: normalizeText(r.mnname)
  })).filter((r) => r.code);

  const shiftMap = indexByCode(shifts);
  const mealMap = indexByCode(meals);
  const menuMap = indexByCode(menus);

  const nowText = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  const orderSheetRows = [];

  entries.forEach((entry) => {
    const dayOff = normalizeCode(entry.dayOff) === 'Y';
    if (dayOff) return;

    const orderDate = normalizeText(entry.orderDate);
    const shiftCode = normalizeCode(entry.shiftCode);
    const mealCode = normalizeCode(entry.mealCode);
    const menuCode = normalizeCode(entry.menuCode);
    const overtime = normalizeCode(entry.overtime);
    const overtimeMealCode = normalizeCode(entry.overtimeMealCode);

    const shift = shiftMap[shiftCode];
    const meal = mealMap[mealCode];
    const menu = menuMap[menuCode];

    orderSheetRows.push({
      epuid: employee.code,
      epfullname: employee.name,
      dpcode: employee.dpcode,
      dpname: employee.dpname,
      date: nowText,
      orderdate: orderDate,
      shcode: shift ? shift.code : '',
      shiftname: shift ? shift.name : '',
      mlcode: meal ? meal.code : '',
      mlname: meal ? meal.name : '',
      mlev04: meal ? meal.mlev04 : '',
      mncode: menu ? menu.code : '',
      mnname: menu ? menu.name : ''
    });

    if (overtime === 'Y' && overtimeMealCode) {
      const overtimeMeal = mealMap[overtimeMealCode];
      orderSheetRows.push({
        epuid: employee.code,
        epfullname: employee.name,
        dpcode: employee.dpcode,
        dpname: employee.dpname,
        date: nowText,
        orderdate: orderDate,
        shcode: shift ? shift.code : '',
        shiftname: shift ? shift.name : '',
        mlcode: overtimeMeal ? overtimeMeal.code : '',
        mlname: overtimeMeal ? overtimeMeal.name : '',
        mlev04: overtimeMeal ? overtimeMeal.mlev04 : 'Y',
        mncode: menu ? menu.code : '',
        mnname: menu ? menu.name : ''
      });
    }
  });

  if (orderSheetRows.length === 0) {
    return { success: false, message: 'Không có ngày làm việc hợp lệ để ghi đơn' };
  }

  appendObjects(ss, SHEET_NAMES.ordered, ORDERED_HEADERS, [{
    epcode: epcode,
    week: week,
    year: year,
    date: nowText
  }]);

  appendObjects(ss, SHEET_NAMES.orders, ORDERS_HEADERS, orderSheetRows);

  return {
    success: true,
    message: 'Đăng ký thành công',
    writtenRows: orderSheetRows.length
  };
}

function handleSyncMasterData(payload) {
  const providedKey = normalizeText(payload.apiKey || payload.apikey || payload.token);
  const expectedKey = normalizeText(PropertiesService.getScriptProperties().getProperty('SYNC_API_KEY'));

  if (!expectedKey) {
    return { success: false, message: 'Missing Script Property: SYNC_API_KEY' };
  }

  if (!providedKey || providedKey !== expectedKey) {
    return { success: false, message: 'Unauthorized sync request' };
  }

  const tables = payload.tables || {};
  const ss = getWorkbook();
  const syncResult = {};

  SYNCABLE_SHEETS.forEach((sheetKey) => {
    const tablePayload = tables[sheetKey];
    if (tablePayload === undefined || tablePayload === null) {
      syncResult[sheetKey] = { synced: false, rows: 0, message: 'Skipped (no payload)' };
      return;
    }

    const parsed = parseIncomingTable(tablePayload);
    if (!parsed.success) {
      throw new Error('Invalid payload for ' + sheetKey + ': ' + parsed.message);
    }

    const sheetName = SHEET_NAMES[sheetKey];
    const headers = parsed.headers.length > 0 ? parsed.headers : getSheetHeaders(ss, sheetName);
    if (headers.length === 0) {
      throw new Error('Headers are required for ' + sheetKey + '. Send non-empty data or include columns.');
    }

    replaceSheetData(ss, sheetName, headers, parsed.rows);
    syncResult[sheetKey] = { synced: true, rows: parsed.rows.length };
  });

  return {
    success: true,
    message: 'Master data synchronized',
    result: syncResult
  };
}

function appendObjects(ss, sheetName, headers, objects) {
  const sheet = ensureSheet(ss, sheetName, headers);
  const values = objects.map((obj) => headers.map((h) => obj[h] || ''));
  const startRow = Math.max(sheet.getLastRow() + 1, 2);
  sheet.getRange(startRow, 1, values.length, headers.length).setValues(values);
}

function replaceSheetData(ss, sheetName, headers, rows) {
  const safeHeaders = Array.isArray(headers)
    ? headers.map((h) => normalizeText(h)).filter(Boolean)
    : [];

  if (safeHeaders.length === 0) {
    throw new Error('Headers are required for sheet ' + sheetName);
  }

  const sheet = ensureSheet(ss, sheetName, safeHeaders);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, safeHeaders.length).setValues([safeHeaders]);

  if (!rows || rows.length === 0) {
    return;
  }

  const values = rows.map((row) => safeHeaders.map((h) => row[h] === undefined || row[h] === null ? '' : row[h]));
  sheet.getRange(2, 1, values.length, safeHeaders.length).setValues(values);
}

function getSheetHeaders(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 1) return [];

  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  return sheet.getRange(1, 1, 1, lastColumn)
    .getValues()[0]
    .map((h) => normalizeText(h))
    .filter(Boolean);
}

function parseIncomingTable(tablePayload) {
  if (Array.isArray(tablePayload)) {
    return parseArrayOfObjectsTable(tablePayload);
  }

  if (tablePayload && typeof tablePayload === 'object') {
    const columns = Array.isArray(tablePayload.columns) ? tablePayload.columns : null;

    if (columns && Array.isArray(tablePayload.rows)) {
      return parseColumnsRowsTable(columns, tablePayload.rows);
    }

    if (Array.isArray(tablePayload.data)) {
      return parseArrayOfObjectsTable(tablePayload.data);
    }
  }

  return { success: false, message: 'Expected array, {columns, rows}, or {data}' };
}

function parseArrayOfObjectsTable(rows) {
  const normalizedRows = rows.filter((r) => r && typeof r === 'object' && !Array.isArray(r));
  if (normalizedRows.length === 0) {
    return { success: true, headers: [], rows: [] };
  }

  const headerSet = {};
  normalizedRows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      const normalizedKey = normalizeText(key);
      if (normalizedKey) headerSet[normalizedKey] = true;
    });
  });
  const headers = Object.keys(headerSet);

  return {
    success: true,
    headers: headers,
    rows: normalizedRows.map((row) => {
      const result = {};
      headers.forEach((h) => {
        result[h] = row[h];
      });
      return result;
    })
  };
}

function parseColumnsRowsTable(columns, rows) {
  const headers = columns.map((c) => normalizeText(c)).filter(Boolean);
  if (headers.length === 0) {
    return { success: false, message: 'Columns are empty' };
  }

  const normalizedRows = rows.map((row) => {
    const result = {};

    if (Array.isArray(row)) {
      headers.forEach((h, idx) => {
        result[h] = idx < row.length ? row[idx] : '';
      });
      return result;
    }

    if (row && typeof row === 'object') {
      headers.forEach((h) => {
        result[h] = row[h];
      });
      return result;
    }

    headers.forEach((h) => {
      result[h] = '';
    });
    return result;
  });

  return { success: true, headers: headers, rows: normalizedRows };
}

function ensureSheet(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  const current = headerRange.getValues()[0].map((v) => normalizeCode(v));
  const expected = headers.map((h) => normalizeCode(h));
  const same = expected.every((h, i) => current[i] === h);
  if (!same) {
    headerRange.setValues([headers]);
  }

  return sheet;
}

function indexByCode(items) {
  const result = {};
  items.forEach((item) => {
    result[item.code] = item;
  });
  return result;
}

function readSheetObjects(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map((h) => normalizeText(h));
  return values.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = row[idx];
    });
    return obj;
  });
}

function getWorkbook() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('Missing Script Property: SPREADSHEET_ID');
  }
  return SpreadsheetApp.openById(spreadsheetId);
}

function getNextWeekWindow() {
  const now = new Date();
  const weekday = now.getDay();
  const daysUntilNextMonday = weekday === 1 ? 7 : ((8 - weekday) % 7 || 7);
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysUntilNextMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const weekYear = getISOWeekYear_(monday);
  return {
    startDate: formatDate_(monday),
    endDate: formatDate_(sunday),
    week: weekYear.week,
    year: weekYear.year
  };
}

function getISOWeekYear_(dateValue) {
  const date = new Date(Date.UTC(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return { week: week, year: date.getUTCFullYear() };
}

function formatDate_(value) {
  return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function normalizeText(value) {
  return String(value === null || value === undefined ? '' : value).trim();
}

function normalizeCode(value) {
  return normalizeText(value).toUpperCase();
}

function isYesValue(value) {
  const normalized = normalizeCode(value);
  return normalized === 'Y' || normalized === '1' || normalized === 'TRUE';
}

function parseBody(raw) {
  if (!raw) return {};
  return JSON.parse(raw);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
