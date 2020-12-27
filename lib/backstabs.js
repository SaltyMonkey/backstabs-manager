function backstabsManager(mod) {
	let skillData = new Set();

	mod.game.on("enter_game", () => {
		skillData.clear();
		mod.queryData("/SkillData/Skill@templateId=?/", [mod.game.me.templateId], true, false, ["id", "type"]).then(res => {
			res.forEach(skill => {
				if (skill.attributes.type.toLowerCase() === "catchback") skillData.add(skill.attributes.id);
			});
		});
	});

	mod.hook("C_START_TARGETED_SKILL", 7, { "order": -105 }, event => {
		if (event.targets[0].gameId === 0n && skillData.has(event.skill.id)) {
			mod.send("S_CANNOT_START_SKILL", 4, { skill: event.skill });
			return false;
		}
	});
}

exports.NetworkMod = backstabsManager;