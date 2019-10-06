const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const Member = require('./routes/members');
const MySQL = require('./helpers/mysql');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser());

const healtcheck = (req, res) => {
    res.json({
        status: 'ok'
    });
}

const startApp = (req, res) => {
    console.log(`Server started at port ${PORT}`);
}

(async () => {
    const config = {
        user: '',
        pass: '',
        host: ''
    }
    const connection = await MySQL.createConnection(config);
    console.log(connection);

    const mySqlGetMembers = async (req, res) => {
        const members = await MySQL.search(connection, 'user3', 'members');
        console.log('getMembers');
        console.log(members);
        res.json({
            status: 'ok',
            data: members
        });
    }

    const mySqlGetMemberById = async (req, res) => {
        const {
            id
        } = req.params;
        console.log('getMemberById');
        const member = await MySQL.search(connection, 'user3', 'members', `\`id\` = '${id}'`);
        console.log(member);
        res.json({
            status: 'ok',
            data: member
        });
    }

    const mySqlGetMemberByKeyword = async (req, res) => {
        const keyword = req.query.kw;
        console.log('mySqlGetMemberByKeyword');
        const member = await MySQL.search(connection, 'user3', 'members', `\`name\` LIKE '%${keyword}%' OR \`facebook_profile\` LIKE '%${keyword}%'`);
        if (member.length > 0) {
            res.json({
                status: 'ok',
                data: member
            });
        } else {
            res.json({
                status: 'not found',
                data: null
            })
        }
    }

    const mySqlDeleteMemberById = async (req, res) => {
        const id = req.params.id;
        const result = await MySQL.deleteSql(connection, 'user3', 'members', `\`id\` = '${id}'`);
        if (result) {
            res.json({
                status: 'user has been deleted',
            });
        } else {
            res.json({
                status: 'not found',
                data: null
            })
        }
    }

    const mySqlUpdateMemberById = async (req, res) => {
        const data = req.body;
        const result = await MySQL.update(connection, 'user3', 'members', data);

        if (result) {
            res.json({
                status: 'ok',
                data: result
            });
        } else {
            res.json({
                status: 'not found',
                data: null
            })
        }
    }

    const mySqlCreateMember = async (req, res) => {
        console.log('mySqlCreateMember');
        const data = req.body;
        const response = await MySQL.insert(connection, 'user3', 'members', data);
        console.log(response);
        res.json({
            status: 'ok',
            data: response
        });
    }
    // Routes
    app.get('/healthcheck', healtcheck);
    app.get('/members', mySqlGetMembers);
    app.get('/member/:id', mySqlGetMemberById);
    app.get('/search', mySqlGetMemberByKeyword);
    app.post('/member', mySqlCreateMember);
    app.delete('/member/:id', mySqlDeleteMemberById);
    app.put('/member/:id', mySqlUpdateMemberById);

    // Start Server
    app.listen(PORT, startApp);
})();