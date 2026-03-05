const Group = require("../models/Group");

// desc    Create a group
// route   POST /api/groups
const createGroup = async (req, res, next) => {
  try {
    const { name, description, memberIds } = req.body;

    if (!name || !memberIds?.length) {
      return res
        .status(400)
        .json({ message: "Group name and members are required" });
    }

    const uniqueMembers = [...new Set([...memberIds, req.user._id.toString()])];

    const group = await Group.create({
      name,
      description,
      members: uniqueMembers,
      admins: [req.user._id],
      createdBy: req.user._id,
    });

    await group.populate("members", "-password");
    await group.populate("createdBy", "-password");

    res.status(201).json({ group });
  } catch (error) {
    next(error);
  }
};

// desc    Get all groups for current user
// route   GET /api/groups
const getUserGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("members", "-password")
      .populate("createdBy", "-password")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "username avatar" },
      })
      .sort({ updatedAt: -1 });

    res.json({ groups });
  } catch (error) {
    next(error);
  }
};

// desc    Get a single group by ID
// route   GET /api/groups/:groupId
const getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("members", "-password")
      .populate("admins", "-password")
      .populate("createdBy", "-password");

    if (!group) return res.status(404).json({ message: "Group not found" });

    // Only members can view group details
    const isMember = group.members.some((m) => m._id.equals(req.user._id));
    if (!isMember)
      return res.status(403).json({ message: "Not a member of this group" });

    res.json({ group });
  } catch (error) {
    next(error);
  }
};

// desc    Add members to group
// route   PUT /api/groups/:groupId/members
const addMembers = async (req, res, next) => {
  try {
    const { memberIds } = req.body;
    const group = await Group.findById(req.params.groupId);

    if (!group) return res.status(404).json({ message: "Group not found" });

    const isAdmin = group.admins.some((a) => a.equals(req.user._id));
    if (!isAdmin)
      return res.status(403).json({ message: "Only admins can add members" });

    const newMembers = memberIds.filter((id) => !group.members.includes(id));
    group.members.push(...newMembers);
    await group.save();
    await group.populate("members", "-password");

    res.json({ group });
  } catch (error) {
    next(error);
  }
};

module.exports = { createGroup, getUserGroups, getGroupById, addMembers };
