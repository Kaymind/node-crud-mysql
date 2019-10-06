let members = require('../databases/members');

const getMembers = (req, res) => {
    res.json({
        status: 'ok',
        data: members
    });
}

const getMemberById = (req, res) => {
    const id = +req.params.id;
    const member = members.filter(member => member.id === id);
    member.length > 0 ?
        res.json({
            status: 'ok',
            data: member
        }) :
        res.json({
            status: 'not found',
            data: null
        });
}

const getMemberByKeyword = (req, res) => {
    const keyword = req.query.kw;
    const isContain = (text, keyword) => text.toLowerCase().includes(keyword.toLowerCase());
    const member = members.filter(member => isContain(member.name, keyword) || isContain(member.fb_profile, keyword));
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

const createMember = (req, res) => {
    const newMember = Object.assign({
        id: members.length + 1
    }, req.body);

    members.push(newMember);
    res.json({
        status: 'ok',
        data: newMember
    })
}

const deleteMemberById = (req, res) => {
    const id = req.params.id;
    const result = members.filter(member => member.id.toString() !== id);
    members = result;

    res.json({
        status: 'ok',
        data: members
    })
}

const updateMemberById = (req, res) => {
    let updateData = {};

    const updateMember = members.map(member => member.id.toString() === req.params.id ? {
        ...member,
        ...req.body
    } : member);

    members = updateMember;

    res.json({
        status: 'ok',
        data: members[req.params.id - 1]
    });
}

module.exports = {
    createMember,
    getMembers,
    getMemberById,
    getMemberByKeyword,
    updateMemberById,
    deleteMemberById
}