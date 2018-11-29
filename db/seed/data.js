'use strict';
const notes = [
  {
    '_id': '000000000000000000000000',
    'title': '5 life lessons learned from cats',
    'content': 'Lorem ipsum dolor sit amet, consect.',
    'folderId': '111111111111111111111102'
  },
  {
    '_id': '000000000000000000000001',
    'title': "What the government doesn't want you to know about cats",
    'content': 'Posuere sollicitudin aliquam  .',
    'folderId': '111111111111111111111103'
  },
  {
    '_id': '000000000000000000000002',
    'title': "The most boring article about cats you'll ever read",
    'content': 'Lorem ipsum dolor sit ame',
    'folderId': '111111111111111111111100'
  },
  {
    '_id': '000000000000000000000003',
    'title': '7 things Lady Gaga has in common with cats',
    'content': 'Posuere sollicitudin aliquam  .',
    'folderId': '111111111111111111111103'
  },
  {
    '_id': '000000000000000000000004',
    'title': "The most incredible article about cats you'll ever read",
    'content': 'Lorem ipsum dolor sit amet, boring consectetur adip',
  },
  {
    '_id': '000000000000000000000005',
    'title': '10 ways cats can help you live to 100',
    'content': 'Posuere sollicitudin aliquam u.',
    'folderId': '111111111111111111111102'
  },
  {
    '_id': '000000000000000000000006',
    'title': '9 reasons you can blame the recession on cats',
    'content': 'Lorem ipsum dolor sit amet, consectetur adipis',
    'folderId': '111111111111111111111100'
  },
  {
    '_id': '000000000000000000000007',
    'title': '10 ways marketers are making you addicted to cats',
    'content': 'Posuere sollicitudin aliquam ultrices s',
    'folderId': '111111111111111111111100'
  }
];

const folders = [
  {
    '_id': '111111111111111111111100',
    'name': 'Archive'
  },
  {
    '_id': '111111111111111111111101',
    'name': 'Drafts'
  },
  {
    '_id': '111111111111111111111102',
    'name': 'Personal'
  },
  {
    '_id': '111111111111111111111103',
    'name': 'Work'
  }
];

module.exports = { notes, folders };
